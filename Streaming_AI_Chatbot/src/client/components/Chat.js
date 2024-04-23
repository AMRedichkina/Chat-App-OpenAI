import React, { useRef, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import './Chat.css';
import Header from './chat/header/header';
import InputComponent from './chat/input/input';
import MessageList from './chat/messages/messageList/messageList';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { addMessage, updateMessage } from '../store/slices/messageSlice';
import { saveMessages } from '../store/thunks/messageThunk';

Chart.register(...registerables);

const Chat = () => {
  const messages = useSelector(state => state.messages.value, shallowEqual);
  const dispatch = useDispatch();
  const ws = useRef(null);

  useEffect(() => {
    function connectWebSocket() {
        const socket = new WebSocket('ws://localhost:3001');
        socket.onopen = () => console.log("Connected to WebSocket server on port 3001");
        socket.onerror = error => console.log("WebSocket error: ", error);
        socket.onmessage = event => handleWebSocketMessage(JSON.parse(event.data));
        socket.onclose = () => {
            console.log("WebSocket disconnected");
            setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
        };
        return socket;
    }

    function handleWebSocketMessage(data) {
        console.log(`data ${JSON.stringify(data)}`)
        if (data.type === 'text-start') {
            dispatch(addMessage({ id: data.id, type: data.type, text: data.text, from: 'Bot' }));
        } else if (data.type === 'text-progress' || data.type === 'text-end') {
            dispatch(updateMessage({ id: data.id, type: data.type, text: data.text, from: 'Bot' }));
        } else {
            console.error('Unknown message type received:', data.type);
        }  
    }

    ws.current = connectWebSocket();
    return () => {
        ws.current?.close();
    };
}, [dispatch]);

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
      fetchStatistics(text.trim().substring(11));
    } else {
      sendTextMessage(text);
    }
  })

  const sendTextMessage = useCallback((text) => {
    console.log(`WebSocket State: ${ws.current ? ws.current.readyState : 'undefined'}`);
    if (!text.trim()) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'text', message: text }));
    } else {
        console.error('WebSocket is not connected.');
    }
  });

  const fetchStatistics = useCallback(async (query) => {
    try {
        const response = await axios.post('/api/statistics', { query });
        console.log("Response front:", response);
        console.log("Response.data front:", response.data);
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
        console.error('Failed to fetch statistics:', error);
        dispatch(addMessage({ type: 'error', text: "Failed to fetch statistics", from: 'Bot' }));
    }
  });


  const inputRef = useRef('');
  const onHashtagAdded = useCallback((callback) => {
    if (inputRef.current) {
      callback(inputRef.current.value);
    }
  }, []);

  return (
    <>
        <div className="chat-container-main">
          <Header onHashtagAdded={onHashtagAdded} />
          <MessageList />
          <InputComponent inputRef={inputRef} sendMessage={sendMessage}/>
       </div>
    </>
  );
};

export default Chat;

