import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ChartMessage from '../chartMessage/chartMessage';
import TextMessage from '../textMessage/textMessage';

/**
 * A memoized component for displaying a list of messages.
 * 
 * This component renders a list of messages and automatically scrolls to the
 * bottom when new messages are added. It uses memoization to prevent unnecessary
 * re-renders and fetches the messages from the Redux store.
 * 
 * Each message object should have the following structure:
 * {
 *   id: string,       // Unique identifier of the message
 *   type: string,     // Type of the message (e.g., 'chart-bot', 'text-user')
 *   text: string,     // Content of the message
 *   from: string,     // Sender of the message ('You' or 'Bot')
 *   timestamp: string // Timestamp of the message creation (ISO format)
 *   data?: object     // Additional data (only for messages with type 'chart-bot')
 * }
 * 
 * @returns {JSX.Element} The list of messages.
 */
const MessageList = React.memo(() => {
  // Fetching messages from the Redux store
  const messages = useSelector(state => state.messages.value);

  // Reference for the last message element
  const messagesEndRef = useRef(null);

  /**
   * Scrolls to the bottom of the message list.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Automatically scroll to the bottom when the messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat__messages-list">
      {messages.map((msg, index) => {
        const key = `${msg.id}-${msg.timestamp}`;
        return (
          <div key={key} className={`chat__message ${msg.from === 'You' ? 'chat__user' : 'chat__bot'}`} data-testid={`message-${index}`}>
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
