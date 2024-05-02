import { Provider } from 'react-redux';
import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import MessageList from './messageList';
import { configureStore } from '@reduxjs/toolkit';

import { createMessageSlice } from '../../../../store/slices/messageSlice';

describe('MessageList Component', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    window.localStorage.clear();
  });

  it('renders correctly without messages in the localStorage', () => {
    const store = configureStore({
        reducer: {
          messages: createMessageSlice({testLocalStorage: window.localStorage}).reducer,
        }
    });
    const { container } = render(
      <Provider store={store}>
        <MessageList />
      </Provider>
    );
    const messagesArray = container.querySelectorAll('.message');
    expect(messagesArray.length).toBe(0);
  });

  it('renders correctly with messages in the localStorage', () => {
    const messages = [{
      id: 0,
      type: 'text-user',
      text: 'Hello',
      from: 'You',
      timestamp: new Date().toISOString()
    }, 
    {
        id: "3080dc32-0878-4898-9f57-2e9a3c4046c3",
        type: 'text-progress',
        text: ' today',
        from: 'Bot',
        timestamp: '2024-04-30T13:21:24.291Z'
    },
    ];

    const existingMessages = JSON.parse(window.localStorage.getItem('messages')) || [];
    const updatedMessages = [...existingMessages, ...messages];
    window.localStorage.setItem('messages', JSON.stringify(updatedMessages));
    const newStore = configureStore({
        reducer: {
          messages: createMessageSlice({testLocalStorage: window.localStorage}).reducer,
        }
    });
    render(
      <Provider store={newStore}>
        <MessageList />
      </Provider>
    );
    const messagesArray = screen.getAllByTestId((id) => id.startsWith('message-'));
    expect(messagesArray.length).toBe(2)
  });

  it('scrolls to bottom when new message is added', async () => {
    const testStore = configureStore({
      reducer: {
        messages: createMessageSlice({testLocalStorage: window.localStorage}).reducer,
      }
    });
    act(() => {
        testStore.dispatch({ type: 'messages/clearMessages' });
      });

    render(
      <Provider store={testStore}>
        <MessageList />
      </Provider>
    );

    const messages = [
      { id: '1', type: 'text-user', text: 'By ensuring your tests have unique global state, Jest can reliably run tests in parallel. To make things quick, Jest runs previously failed tests first and re-organizes runs based on how long test files take.', from: 'You', timestamp: '2024-05-01T12:00:00.000Z' },
      { id: '2', type: 'text-bot', text: 'By ensuring your tests have unique global state, Jest can reliably run tests in parallel. To make things quick, Jest runs previously failed tests first and re-organizes runs based on how long test files take.!', from: 'Bot', timestamp: '2024-05-01T12:01:00.000Z' },
      { id: '3', type: 'text-bot', text: 'By ensuring your tests have unique global state, Jest can reliably run tests in parallel. To make things quick, Jest runs previously failed tests first and re-organizes runs based on how long test files take.!', from: 'Bot', timestamp: '2024-05-01T12:01:00.000Z' },
      { id: '4', type: 'text-bot', text: 'Test3', from: 'Bot', timestamp: '2024-05-01T12:01:00.000Z' },
    ];
    
    act(() => {
        messages.forEach(message => {
          testStore.dispatch({ type: 'messages/addMessage', payload: message });
        });
    });
    const lastMessage = await screen.findByText('Test3');
    await waitFor(() => {
        expect(lastMessage).toBeVisible();
      });
  });
});