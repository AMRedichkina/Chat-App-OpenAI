import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Async thunk action creator for saving messages to localStorage.
 * 
 * This function creates an async thunk action creator to save messages from the Redux store to localStorage.
 * 
 * @param {string} payload - Payload parameter (not used).
 * @param {Object} thunkAPI - Thunk API object.
 * @param {Function} thunkAPI.getState - Function to get the current state from the Redux store.
 * @returns {Promise} A Promise that resolves when the messages are saved successfully.
 */
export const saveMessages = createAsyncThunk(
  'messages/saveMessages',
  async (_, { getState }) => {
    const { messages } = getState();
    localStorage.setItem('messages', JSON.stringify(messages.value));
  }
);
