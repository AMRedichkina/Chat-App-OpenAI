import { createSlice } from '@reduxjs/toolkit'

const initialMessages = () => {
    const storedMessages = localStorage.getItem('messages');
    console.log('Stored messages:', storedMessages);
    if (!storedMessages || storedMessages === "undefined") {
        console.log('No valid data found in localStorage, initializing with an empty array.');
        return [];
    }
    try {
        return JSON.parse(storedMessages);
    } catch (e) {
        console.error('Failed to parse messages from localStorage:', e);
        console.error('Corrupted data:', storedMessages);
        return [];
    }
}

export const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    value: initialMessages(),
  },
  reducers: {
    setMessages: (state, action) => {
        state.value = action.payload;
    },
    addMessage: (state, action) => {
        state.value.push({
            id: action.payload.id,
            type: action.payload.type,
            text: action.payload.text,
            data: action.payload.data,
            from: action.payload.from,
            timestamp: new Date().toISOString()
        });
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
        } else {
            console.error("Attempted to update non-existent message with id:", action.payload.id);
        }
    },
    clearMessages: (state) => {
        state.value = [];
    },
    removeMessage: (state, action) => {
        state.value = state.value.filter(msg => msg.id !== action.payload.id);
    }
  },
})

export const { setMessages, addMessage, updateMessage, clearMessages, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
