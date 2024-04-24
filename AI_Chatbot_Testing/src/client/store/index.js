import { configureStore } from '@reduxjs/toolkit';
import messageReduser from './slices/messageSlice';

const store = configureStore({
  reducer: {
    messages: messageReduser,
  }
});

export default store; 