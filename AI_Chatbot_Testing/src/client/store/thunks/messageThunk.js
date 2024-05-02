import { createAsyncThunk } from '@reduxjs/toolkit';

export const saveMessages = createAsyncThunk(
    'messages/saveMessages',
    async (_, { getState }) => {
      const { messages } = getState();
      localStorage.setItem('messages', JSON.stringify(messages.value));
    }
  );
  