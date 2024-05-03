import React, { createContext, useContext, useEffect, useState } from 'react';
import { createWebSocket, closeWebSocket } from '../utils/webSocketService';

const WebSocketContext = createContext(null);

/**
 * Provides a WebSocket context to its children.
 *
 * The WebSocketProvider component creates and manages a WebSocket connection.
 * It takes an optional custom socket as a prop for tests and defaults to creating a
 * WebSocket at 'ws://localhost:3001'. The socket is provided to all children
 * through a context.
 *
 * @param {React.ReactNode} children - The components that will have access to the WebSocket.
 * @param {WebSocket|null} [customSocket=null] - An optional custom WebSocket to use.
 * @returns {JSX.Element} The provider component.
 */
export const WebSocketProvider = ({ children, customSocket = null }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = customSocket || createWebSocket('ws://localhost:3001');
    setSocket(newSocket);

    // Cleanup: close the WebSocket when the component unmounts
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

/**
 * Custom hook to access the WebSocket context.
 * 
 * @returns {WebSocket|null} The current WebSocket instance.
 */
export const useWebSocket = () => useContext(WebSocketContext);
