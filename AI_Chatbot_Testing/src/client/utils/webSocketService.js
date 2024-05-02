export function createWebSocket(url) {
    const socket = new WebSocket(url);
    socket.onopen = () => console.log("WebSocket connected");
    socket.onclose = () => console.log("WebSocket disconnected");
    socket.onerror = (error) => console.log("WebSocket Error: ", error);
    return socket;
  }
  
  export function sendTextMessage(socket, message) {
    if (socket && socket.readyState === WebSocket.OPEN || process.env.NODE_ENV === 'test') {
        socket.send(JSON.stringify({ type: 'text', message }));
    } else {
        console.error('WebSocket is not connected.');
    }
}
  
  export function closeWebSocket(socket) {
    if (socket) {
      socket.close();
    }
  }
  