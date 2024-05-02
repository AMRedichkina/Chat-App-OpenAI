import React, { createContext, useContext, useEffect, useState } from 'react';
import { createWebSocket, closeWebSocket } from '../utils/webSocketService';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, customSocket = null }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = customSocket || createWebSocket('ws://localhost:3001');
    setSocket(newSocket);

    return () => {
      closeWebSocket(socket);
    };
  }, [customSocket]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
