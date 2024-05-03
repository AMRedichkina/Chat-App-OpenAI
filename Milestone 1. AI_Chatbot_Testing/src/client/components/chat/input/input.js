import React, { useState, useCallback, useEffect, forwardRef } from 'react';
import { Input, Icon } from 'semantic-ui-react';
import './input.css';

/**
 * A memoized input component for sending messages.
 * 
 * This component provides an input field for typing messages and handles sending messages
 * either by pressing Enter or clicking the send icon. It utilizes memoization to prevent
 * unnecessary re-renders.
 * 
 * @param {Function} sendMessage - The function to send a message.
 * @param {React.Ref} ref - The reference to the input field.
 * @returns {JSX.Element} The rendered input component.
 */
const InputComponent = forwardRef(function InputComponent({ sendMessage }, ref) {
  const [input, setInput] = useState('');

  // Focus and move cursor to the end of the input value
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      const length = ref.current.value.length;
      ref.current.setSelectionRange(length, length);
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  // Handle Enter key press to send message
  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      sendMessage(input);
      setInput('');
    }
  }, [input, sendMessage]);

  // Handle send icon click to send message
  const handleClick = useCallback(() => {
    sendMessage(input);
    setInput('');
  }, [input, sendMessage]);

  return (
    <>
      <div className="chat__container-input"></div>
      <div className="input__field-container">
        <Input
          fluid
          className="input__field"
          icon={<Icon name='send' link onClick={handleClick} data-testid="send-icon" />}
          placeholder="Type your message..."
          value={input}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          input={{ ref: ref }}
        />
      </div>
    </>
  )
});

export default InputComponent;