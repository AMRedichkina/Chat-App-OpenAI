import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import Header from './header';
import { addMessage } from '../../../store/slices/messageSlice';
import store from '../../../store/index';

describe('Header Component', () => {
    it('should clear all messages when delete icon is clicked', async() => {
      store.dispatch(addMessage({ id: '1', text: 'Hello', from: 'User' }));
      store.dispatch(addMessage({ id: '2', text: 'Hi', from: 'Bot' }));
      render(
        <Provider store={store}>
          <Header onHashtagAdded={jest.fn()} />
        </Provider>
      );
      expect(store.getState().messages.value).toHaveLength(2);
      const deleteIcon = screen.getByTestId('delete-icon');
      userEvent.click(deleteIcon);
      await waitFor(() => {
        expect(store.getState().messages.value).toHaveLength(0);
      });
    });
  });

