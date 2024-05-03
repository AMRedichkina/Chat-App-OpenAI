import React, { useRef, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import './Chat.css';
import Header from './chat/header/header.js';
import InputComponent from './chat/input/input.js';
import MessageList from './chat/messages/messageList/messageList.js';
import { addMessage, updateMessage } from '../store/slices/messageSlice.js';
import { saveMessages } from '../store/thunks/messageThunk.js';
import { sendTextMessage } from '../utils/webSocketService.js';
import { useWebSocket } from '../context/WebSocketContext.js';

// Register all chart.js components
Chart.register(...registerables);

const Chat = () => {
  // Selectors and dispatch
  const messages = useSelector(state => state.messages.value, shallowEqual);
  const dispatch = useDispatch();
  const socket = useWebSocket();
  const inputRef = useRef('');

  // Effect for handling incoming WebSocket messages
  useEffect(() => {
    function handleWebSocketMessage(data) {
      switch (data.type) {
        case 'text-start':
          dispatch(addMessage({ id: data.id, type: data.type, text: data.text, from: 'Bot' }));
          break;
        case 'text-progress':
        case 'text-end':
          dispatch(updateMessage({ id: data.id, type: data.type, text: data.text, from: 'Bot' }));
          break;
        case 'error':
          console.error('Server Error:', data.message);
          dispatch(addMessage({ id: uuidv4(), type: 'error', text: data.message, from: 'Bot' }));
          break;
        default:
          console.error('Unknown message type received:', data.type);
      }
    }

    if (socket) {
      socket.onmessage = event => handleWebSocketMessage(JSON.parse(event.data));
    }
  }, [socket, dispatch]);

  // Effect for saving messages to the local storage using thunk
  useEffect(() => {
    if (messages.length > 0) {
      dispatch(saveMessages());
    }
  }, [messages, dispatch]);

  /**
 * Sends a user's message.
 * 
 * Saves the message to the store and sends it to the API or WebSocket server. 
 * If the message starts with "#diagram", it triggers a chart generation request; 
 * otherwise, it sends the message to the WebSocket server.
 *
 * @param {string} text - The user's input message.
 */
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

  /**
 * Fetches statistics from the API and saves chart data as a message in the store.
 * 
 * Sends a POST request to the statistics API with a user's query. 
 * It processes the response to create chart data and dispatches an action to save 
 * the chart data as a message in the store. In case of an error, it dispatches an 
 * error message with a user-friendly advice.
 * 
 * @param {string} query - The query to fetch statistics for.
 */
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
      dispatch(addMessage({ id: idMessage, type: 'chart-bot', data: chartData, from: 'Bot' }));
    } catch (error) {
      const friendlyAdvice = `It seems like there was an issue with how the question was formulated or server error.
      \nFeel free to rephrase your question and try again or ask me later. I'm here to help!`;

      dispatch(addMessage({ type: 'error', text: friendlyAdvice, from: 'Bot' }));
    }
  });

  /**
 * Callback function to add a hashtag to the input field.
 * 
 * This function is triggered from the Header component to add a hashtag to the 
 * current input value.
 * 
 * @param {string} value - The hashtag to be added.
 */
  const onHashtagAdded = useCallback((value) => {
    if (inputRef.current) {
      const newValue = value.trim() + ' ' + inputRef.current.value;
      inputRef.current.value = newValue;
    }
  }, []);

  return (
    <>
      <div className="chat__container-main">
        <Header onHashtagAdded={onHashtagAdded} />
        <MessageList />
        <InputComponent sendMessage={sendMessage} ref={inputRef} />
      </div>
    </>
  );
};

export default Chat;
