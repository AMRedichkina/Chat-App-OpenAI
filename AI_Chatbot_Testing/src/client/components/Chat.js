import React, { useRef, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import './Chat.css';
import Header from './chat/header/header';
import InputComponent from './chat/input/input';
import MessageList from './chat/messages/messageList/messageList';
import { addMessage, updateMessage } from '../store/slices/messageSlice.js';
import { saveMessages } from '../store/thunks/messageThunk';
import { sendTextMessage } from '../utils/webSocketService';
import { useWebSocket } from '../context/WebSocketContext.js';

Chart.register(...registerables);

const Chat = () => {
  const messages = useSelector(state => state.messages.value, shallowEqual);
  const dispatch = useDispatch();
  const socket = useWebSocket();
  const inputRef = useRef('');

  useEffect(() => {
    function handleWebSocketMessage(data) {
      if (data.type === 'text-start') {
          dispatch(addMessage({ id: data.id, type: data.type, text: data.text, from: 'Bot' }));
      } else if (data.type === 'text-progress' || data.type === 'text-end') {
          dispatch(updateMessage({ id: data.id, type: data.type, text: data.text, from: 'Bot' }));
      } else {
          console.error('Unknown message type received:', data.type);
      }  
    }
    if (socket) {
      socket.onmessage = event => handleWebSocketMessage(JSON.parse(event.data));
    }
  }, [socket, dispatch]);

  useEffect(() => {
    if (messages.length > 0) {
      dispatch(saveMessages());
    }
  }, [messages, dispatch]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const idMessage = uuidv4();
    dispatch(addMessage({ id: idMessage, type: 'text-user', text, from: 'You' })); 
    if (text.trim().toLowerCase().startsWith('#diagram')) {
      fetchStatistics(text.trim().substring(9));
    } else {
      sendTextMessage(socket, text);
    }
  })

  const fetchStatistics = useCallback(async (query) => {
    try {
        const response = await axios.post('/api/statistics', { query });
        const idMessage = uuidv4();
        const chartData = {
            labels: response.data.labels,
            datasets: [{
                label: response.data.datasets[0].label,
                data: response.data.datasets[0].data,
                backgroundColor: response.data.datasets[0].data.map(value =>
                  `rgba(${value % 255}, ${100 + (value % 155)}, 132, 0.6)`),
                borderColor: response.data.datasets[0].data.map(value =>
                  `rgba(${value % 255}, ${100 + (value % 155)}, 132, 1)`),
                borderWidth: 1,
            }]
        };
        dispatch(addMessage({id: idMessage, type: 'chart-bot', data: chartData, from: 'Bot'}));
    } catch (error) {
      const friendlyAdvice = `It seems like there was an issue with how the request was formulated. To help me understand better, please:
      - Use clear and specific questions.
      - Avoid using slang or overly complex sentences.
      - Provide context if the question is about a specific topic or detail.
      \nFeel free to rephrase your question and try again. I'm here to help!`;
  
      dispatch(addMessage({ type: 'error', text: friendlyAdvice, from: 'Bot' }));
    }
  });

  const onHashtagAdded = useCallback((value) => {
    if (inputRef.current) {
      const newValue = value.trim() + ' ' + inputRef.current.value;
      inputRef.current.value = newValue;
    }
  }, []);

  return (
    <>
        <div className="chat-container-main">
          <Header onHashtagAdded={onHashtagAdded} />
          <MessageList />
          <InputComponent sendMessage={sendMessage} ref={inputRef}/>
       </div>
    </>
  );
};

export default Chat;
