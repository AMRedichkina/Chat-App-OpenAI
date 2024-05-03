import { createSlice } from '@reduxjs/toolkit';

/**
 * Creates a slice for managing messages in the Redux store.
 * 
 * This function creates a slice with reducers for setting, adding, updating, clearing, and removing messages.
 * It also initializes the initial state by retrieving messages from localStorage if available.
 * 
 * @param {Object} options - Options object.
 * @param {Object} options.testLocalStorage - Test localStorage object for testing purposes.
 * @returns {Object} The created message slice.
 */
export const createMessageSlice = ({ testLocalStorage = localStorage } = {}) => {
    /**
     * Retrieves initial messages from localStorage or returns an empty array if not found or unable to parse.
     * 
     * @returns {Array} The initial messages array.
     */
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
