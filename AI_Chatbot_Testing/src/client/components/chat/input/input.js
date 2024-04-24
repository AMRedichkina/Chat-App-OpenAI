import React, {useState, useCallback, useEffect, forwardRef} from 'react';
import { Input, Icon } from 'semantic-ui-react';
import './input.css';

const InputComponent = forwardRef(function InputComponent({sendMessage}, ref) {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
        const length = ref.current.value.length;
        ref.current.setSelectionRange(length, length);
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
            icon={<Icon name='send' link onClick={handleClick} data-testid="send-icon"/>}
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