import React, {useState, useCallback, useEffect} from 'react';
import { Input, Icon } from 'semantic-ui-react';
import './input.css';

export default function InputComponent({inputRef, sendMessage}) {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.focus();
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
    }
  }, [input]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      sendMessage(input);
      setInput('');
    }
  }, [input, sendMessage]);

  const handleClick = useCallback(() => {
      sendMessage(input);
      setInput('');
  }, [input, sendMessage]);

  return (
      <>
        <div className="chat-container-input"></div>
        <div className="input-field-container">
          <Input
            fluid
            className="input-field"
            icon={<Icon name='send' link onClick={handleClick} />}
            placeholder="Type your message..."
            value={input}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            input={{ ref: inputRef }} 
          />
        </div>
      </>
  )
}
