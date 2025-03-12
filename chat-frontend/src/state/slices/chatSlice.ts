import {ChatMessage, ChatState} from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatState = {
    selectedChatMessages: [],
    selectedModel: undefined,
    userModels : undefined,
    isLoading: false,
    error: null,
};

/**
 * Chat slice for Redux store to manage chat state in the frontend application
 * This slice handles operations related to chat selection, messages, textbooks, file operations, loading state, and errors
 * @author Sriram Sundar
 */
const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        /**
         * Sets the messages for the selected chat
         * @param {ChatState} state - The current chat state
         * @param {PayloadAction<ChatMessage[]>} action - The messages to set
         */
        setSelectedChatMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.selectedChatMessages = action.payload;
        },

        setSelectedModel: (state, action) => {
            state.selectedModel = action.payload;
        },

        setUserModels: (state, action) => {
            state.userModels = action.payload;
        },

        /**
         * Adds a new chat message to the selected chat
         * @param {ChatState} state - The current chat state
         * @param {PayloadAction<ChatMessage>} action - The message to add
         */
        addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.selectedChatMessages.push(action.payload);
        },

        /**
         * Updates an existing chat message
         * @param {ChatState} state - The current chat state
         * @param {PayloadAction<{ id: string; updates: Partial<ChatMessage> }>} action - The message updates
         */
        updateChatMessage: (
            state,
            action: PayloadAction<{ id: string; updates: Partial<ChatMessage> }>
        ) => {
            const index = state.selectedChatMessages.findIndex(
                (msg) => msg.id === action.payload.id
            );
            if (index !== -1) {
                state.selectedChatMessages[index] = {
                    ...state.selectedChatMessages[index],
                    ...action.payload.updates,
                };
            }
        },

        /**
         * Sets the loading state for chat operations
         * @param {ChatState} state - The current chat state
         * @param {PayloadAction<boolean>} action - The loading state to set
         */
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        /**
         * Sets the error state for chat operations
         * @param {ChatState} state - The current chat state
         * @param {PayloadAction<string | null>} action - The error message to set
         */
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        /**
         * Closes the current chat and resets related state
         * @param {ChatState} state - The current chat state
         */
        closeChat: (state) => {
            state.selectedChatMessages = [];
            state.error = null;
        },
    },
});

export const {
    setSelectedChatMessages,
    setSelectedModel,
    setUserModels,
    addChatMessage,
    updateChatMessage,
    setLoading,
    setError,
    closeChat,
} = chatSlice.actions;

export default chatSlice.reducer;

/**
 * Selector to get the messages of the currently selected chat from the Redux store
 * @param {{ chat: ChatState }} state - The Redux state
 * @returns {ChatMessage[]} An array of chat messages for the selected chat
 */
export const selectChatMessages = (state: { chat: ChatState }) =>
    state.chat.selectedChatMessages;

/**
 * Selector to get the loading state of chat operations from the Redux store
 * @param {{ chat: ChatState }} state - The Redux state
 * @returns {boolean} The loading state of chat operations
 */
export const selectChatLoading = (state: { chat: ChatState }) =>
    state.chat.isLoading;

/**
 * Selector to get any error related to chat operations from the Redux store
 * @param {{ chat: ChatState }} state - The Redux state
 * @returns {string | null} The error message, if any, or null
 */
export const selectChatError = (state: { chat: ChatState }) => state.chat.error;

export const selectUserModels = (state: {chat: ChatState}) => state.chat.userModels;