import { configureStore } from '@reduxjs/toolkit';
import  { createMessageSlice } from '../store/slices/messageSlice';

const store = configureStore({
  reducer: {
    messages: createMessageSlice().reducer,
  }
});

export default store; 