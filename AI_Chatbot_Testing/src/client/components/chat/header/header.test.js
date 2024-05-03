import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import Header from './header.js';
import { addMessage } from '../../../store/slices/messageSlice.js';
import store from '../../../store/index';

describe('Header Component', () => {
  it('should clear all messages when delete icon is clicked', async () => {
    // Add some messages to the store
    store.dispatch(addMessage({ id: '1', text: 'Hello', from: 'User' }));
    store.dispatch(addMessage({ id: '2', text: 'Hi', from: 'Bot' }));

    // Render the Header component with the store provider
    render(
      <Provider store={store}>
        <Header onHashtagAdded={jest.fn()} />
      </Provider>
    );

    // Check if messages are initially present
    expect(store.getState().messages.value).toHaveLength(2);

    const deleteIcon = screen.getByTestId('delete-icon');
    userEvent.click(deleteIcon);

    // Wait for messages to be cleared
    await waitFor(() => {
      expect(store.getState().messages.value).toHaveLength(0);
    });
  });
});

