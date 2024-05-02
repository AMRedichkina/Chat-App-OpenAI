// Chat.test.js

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import Chat from './Chat';
import MockWebSocket from '../../../__mocks__/clientWebSocketMock'
import { WebSocketProvider } from '../context/WebSocketContext';
import axiosMock from '../../../__mocks__/axiosMocks'
import { createMessageSlice } from '../store/slices/messageSlice.js';

describe('Chat Integration Tests', () => {
    let store;
    let mockWebSocket;
  
    beforeEach(() => {
      store = configureStore({
        reducer: {
          messages: createMessageSlice({ testLocalStorage: window.localStorage }).reducer,
        }
      });
      mockWebSocket = new MockWebSocket('ws://localhost:3001');
      render(
        <Provider store={store}>
          <WebSocketProvider customSocket={mockWebSocket}>
            <Chat />
          </WebSocketProvider>
        </Provider>
      );
    });

    afterEach(() => {
        jest.clearAllMocks();  // Очистит все моки
    });

    it('should SEND a message when the send button is clicked to WS', async () => {
        const input = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByTestId('send-icon');

        fireEvent.change(input, { target: { value: 'Hello, world!' } });
        fireEvent.click(sendButton);
        await waitFor(() => {
            expect(mockWebSocket.messages).toContainEqual(JSON.stringify({ type: 'text', message: 'Hello, world!' }));
        });
    });

    it('should RECEIVE WebSocket messages correctly', async () => {
        const mockMessage = { id: '123', type: 'text-start', text: 'Processing...', from: 'Bot' };
        act(()=>{
            mockWebSocket.simulateMessage(JSON.stringify(mockMessage));
        });
        await waitFor(()=> {
            const messages = store.getState().messages.value;
            expect(messages).toContainEqual({...mockMessage, timestamp: expect.any(String)});
        })
    });

    it('should SEND a message (start with #diagram) to API when the send button is clicked', async () => {
        const input = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByTestId('send-icon');
    
        fireEvent.change(input, { target: { value: '#diagram How many people were living in Oslo in 2020?' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(axiosMock.history.post.length).toBe(1);
            expect(axiosMock.history.post[0].data).toContain(JSON.stringify('How many people were living in Oslo in 2020?'));
        });

    });
    it('fetches and displays statistics from API', async () => {
        const input = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByTestId('send-icon');
        const mockMessage = {
            "data": {
                "datasets": [{
                    "backgroundColor": ["rgba(100, 200, 132, 0.6)", "rgba(200, 145, 132, 0.6)", "rgba(150, 250, 132, 0.6)"],
                    "borderColor": ["rgba(100, 200, 132, 1)", "rgba(200, 145, 132, 1)", "rgba(150, 250, 132, 1)"],
                    "borderWidth": 1, "data": [100, 200, 150],
                    "label": "Number of Users"}],
                "labels": ["January", "February", "March"]},
                "from": "Bot",
                "text": undefined, 
                "type": "chart-bot"
            };

        fireEvent.change(input, { target: { value: '#diagram statistics' } });
        fireEvent.click(sendButton);
        

        await waitFor(()=> {
            const messages = store.getState().messages.value;
            expect(messages).toContainEqual({...mockMessage, id: expect.any(String), timestamp: expect.any(String)});
        })
    });
});
