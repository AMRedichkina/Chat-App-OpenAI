import React from 'react';
import Message from '../message/message';

const MessageList = ({ messages, downloadChart, messagesEndRef }) => (
    <div className="messages-list">
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} downloadChart={downloadChart} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );

  export default MessageList;