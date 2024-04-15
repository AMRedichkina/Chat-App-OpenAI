import React from 'react';
import ChartMessage from '../chartMessage/chartMessage';
import TextMessage from '../textMessage/textMessage';

const Message = ({ msg, downloadChart }) => (
    <div className={`message ${msg.from === 'You' ? 'user' : 'bot'}`}>
      {msg.type === 'chart' ? (
        <ChartMessage msg={msg} downloadChart={downloadChart} />
      ) : (
        <TextMessage msg={msg} />
      )}
    </div>
  );

export default Message;