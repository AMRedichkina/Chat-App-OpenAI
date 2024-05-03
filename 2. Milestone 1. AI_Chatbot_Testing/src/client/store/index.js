import { configureStore } from '@reduxjs/toolkit';
import { createMessageSlice } from '../store/slices/messageSlice';

/**
 * Configure and create the Redux store.
 * 
 * This function configures and creates the Redux store with the message slice reducer.
 * 
 * @returns {Object} The Redux store object.
 */
const store = configureStore({
  reducer: {
    messages: createMessageSlice().reducer,
  }
});

export default store; 