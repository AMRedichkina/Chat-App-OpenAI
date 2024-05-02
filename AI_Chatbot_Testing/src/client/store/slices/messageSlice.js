import { createSlice } from '@reduxjs/toolkit';

export const createMessageSlice = ({ testLocalStorage = localStorage } = {}) => {
    const initialMessages = () => {
        const storedMessages = testLocalStorage.getItem('messages');
        if (!storedMessages || storedMessages === "undefined") {
            return [];
        }
        try {
            return JSON.parse(storedMessages);
        } catch (e) {
            console.error('Failed to parse messages from localStorage:', e);
            return [];
        }
    }
    return createSlice({
        name: 'messages',
        initialState: {
          value: initialMessages(),
        },
        reducers: {
          setMessages: (state, action) => {
              state.value = action.payload;
          },
          addMessage: (state, action) => {
            const message = {
                id: action.payload.id,
                type: action.payload.type,
                text: action.payload.text,
                from: action.payload.from,
                timestamp: new Date().toISOString()
            };
            if (action.payload.data) {
                message.data = action.payload.data;
            }
        
            state.value.push(message);
          },
          updateMessage: (state, action) => {
              const index = state.value.findIndex(msg => msg.id === action.payload.id);
              if (index !== -1) {
                  state.value[index] = {
                      ...state.value[index],
                      text: state.value[index].text + action.payload.text, 
                      type: action.payload.type,
                      timestamp: new Date().toISOString()
                  };
              }
          },
          clearMessages: (state) => {
              state.value = [];
          },
          removeMessage: (state, action) => {
              state.value = state.value.filter(msg => msg.id !== action.payload.id);
          }
        },
      });   
}

const defaultSlice = createMessageSlice();
export default defaultSlice.reducer;
export const { setMessages, addMessage, updateMessage, clearMessages, removeMessage } = defaultSlice.actions;
