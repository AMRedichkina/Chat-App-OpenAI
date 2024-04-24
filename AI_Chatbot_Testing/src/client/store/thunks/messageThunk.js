import { createAsyncThunk } from '@reduxjs/toolkit';

export const saveMessages = createAsyncThunk(
    'messages/saveMessages',
    async (_, { getState }) => {
      const { messages } = getState();
      console.log("Saving messages:", messages.value);
      localStorage.setItem('messages', JSON.stringify(messages.value));
    }
  );
  