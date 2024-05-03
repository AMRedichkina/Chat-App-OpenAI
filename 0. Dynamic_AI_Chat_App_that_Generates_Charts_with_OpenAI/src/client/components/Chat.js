import React, { useState, useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import './Chat.css';
import Header from './chat/header/Header';
import InputComponent from './chat/input/input';
import html2canvas from 'html2canvas';
import useMessages from '../hooks/useMessages';
import MessageList from './chat/messages/messageList/messageList';

Chart.register(...registerables);

const Chat = () => {
  const [messages, setMessages] = useMessages();
  const [input, setInput] = useState('');

  const downloadChart = (chartId) => {
    const chartElement = document.getElementById(`chart-${chartId}`);
    html2canvas(chartElement).then((canvas) => {
      const image = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `chart-${chartId}.jpg`;
      link.click();
    });
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const newMessage = { text, from: 'You' };
    setMessages(messages => [...messages, newMessage]);
    if (text.trim().toLowerCase().startsWith('#diagram')) {
      fetchStatistics(text.trim().substring(11));
    } else {
      sendTextMessage(text);
    }
    setInput('');
  }

  const sendTextMessage = async(text) => {
    try {
      const response = await axios.post('/api/message', { message: text });
      const replyMessage = { text: response.data.reply, from: 'Bot' };
      setMessages(messages => [...messages, replyMessage]);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const fetchStatistics = async (query) => {
    try {
        const response = await axios.post('/api/statistics', { query });
        console.log("Response front:", response);
        console.log("Response.data front:", response.data);
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
        const chartMessage = {
            type: 'chart',
            data: chartData,
            from: 'Bot'
        };
        setMessages(messages => [...messages, chartMessage]);
    } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setMessages(messages => [...messages, { text: "Failed to fetch statistics", from: 'Bot' }]);
    }
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  return (
    <>
        <div className="chat-container-main">
          <Header setMessages={setMessages} input={input} setInput={setInput}/>
          <MessageList messages={messages} downloadChart={downloadChart} messagesEndRef={messagesEndRef}/>
          <InputComponent input={input} setInput={setInput} sendMessage={sendMessage}/>
       </div>
    </>
  );
};

export default Chat;

