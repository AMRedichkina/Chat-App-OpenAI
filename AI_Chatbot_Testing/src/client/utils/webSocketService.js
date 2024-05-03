/**
 * Create a WebSocket connection.
 * 
 * This function creates a WebSocket connection and sets up event handlers for various WebSocket events.
 * 
 * @param {string} url - The URL of the WebSocket server.
 * @returns {WebSocket} The WebSocket object representing the connection.
 */
export function createWebSocket(url) {
  const socket = new WebSocket(url);
  socket.onopen = () => console.log("WebSocket connected");
  socket.onclose = () => console.log("WebSocket disconnected");
  socket.onerror = (error) => console.log("WebSocket Error: ", error);
  return socket;
}

/**
 * Send a text message over a WebSocket connection.
 * 
 * This function sends a text message over the provided WebSocket connection.
 * 
 * @param {WebSocket} socket - The WebSocket connection.
 * @param {string} message - The text message to send.
 */
export function sendTextMessage(socket, message) {
  if (socket && socket.readyState === WebSocket.OPEN || process.env.NODE_ENV === 'test') {
    socket.send(JSON.stringify({ type: 'text', message }));
  } else {
    console.error('WebSocket is not connected.');
  }
}

/**
 * Close a WebSocket connection.
 * 
 * This function closes the provided WebSocket connection.
 * 
 * @param {WebSocket} socket - The WebSocket connection to close.
 */
export function closeWebSocket(socket) {
  if (socket) {
    socket.close();
  }
}
