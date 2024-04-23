import React, {useState} from 'react';
import { Input, Icon } from 'semantic-ui-react';
import './input.css';

export default function InputComponent({input, setInput, sendMessage}) {
    return (
        <>
          <div className="chat-container-input"></div>
          <div className="input-field-container">
            <Input
              fluid
              className="input-field"
              icon={<Icon name='send' link onClick={() => sendMessage(input)} />}
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' ? sendMessage(input) : null}
            />
          </div>
        </>
    )
}
