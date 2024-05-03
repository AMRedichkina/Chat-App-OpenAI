import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import TextMessage from './textMessage';
import { createMessageSlice } from '../../../../store/slices/messageSlice';

describe('TextMessage Component', () => {

  it('dispatches removeMessage action on delete icon click', () => {
    // Set up the Mock Redux store
    const store = configureStore({
      reducer: {
        messages: createMessageSlice({ testLocalStorage: window.localStorage }).reducer,
      }
    });

    const mockMsg = {
      id: '123',
      text: 'Hello, world!',
      from: 'You'
    };

    store.dispatch({ type: 'messages/addMessage', payload: mockMsg });

    render(
      <Provider store={store}>
        <TextMessage msg={mockMsg} />
      </Provider>
    );

    const deleteIcon = screen.getByTestId('delete-icon-text');
    fireEvent.click(deleteIcon);

    // Check if the message was removed from the store.
    const messages = store.getState().messages.value;
    const messageExists = messages.some(message => message.id === '123');
    expect(messageExists).toBe(false);

    store.dispatch({ type: 'messages/removeMessage' });
    cleanup();
  });
});
