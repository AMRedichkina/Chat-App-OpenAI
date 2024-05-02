import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ChartMessage from '../chartMessage/chartMessage';
import TextMessage from '../textMessage/textMessage';

const MessageList = React.memo(() => {
  const messages = useSelector(state => state.messages.value);

  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  return (
    <div className="messages-list">
      {messages.map((msg, index) => {
        const key = `${msg.id}-${msg.timestamp}`;
        return (
          <div key={key} className={`message ${msg.from === 'You' ? 'user' : 'bot'}`} data-testid={`message-${index}`}>
            {msg.type === 'chart-bot' ? (
              <ChartMessage msg={msg} />
            ) : (
              <TextMessage msg={msg} />
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
});

export default MessageList;
