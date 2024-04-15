import { useState, useEffect } from 'react';

function useMessages(initial = []) {
    const [messages, setMessages] = useState(() => {
      const storedMessages = localStorage.getItem('messages');
      return storedMessages ? JSON.parse(storedMessages) : initial;
    });
  
    useEffect(() => {
      localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);
  
    return [messages, setMessages];
  }

export default useMessages;