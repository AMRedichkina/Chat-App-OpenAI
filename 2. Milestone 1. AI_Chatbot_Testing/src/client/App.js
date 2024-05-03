import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './components/chat';
import { WebSocketProvider } from './context/WebSocketContext';


function App() {
  return (
    <Router>
      <WebSocketProvider>
        <Routes>
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </WebSocketProvider>
    </Router>
  );
}

export default App;
