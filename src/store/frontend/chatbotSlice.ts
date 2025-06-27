import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export interface ChatMessage {
  text: string;
  from: 'user' | 'bot';
}

interface ChatbotState {
  messages: ChatMessage[];
}

const initialState: ChatbotState = {
  messages: [],
};

// Async thunk to send message to backend API
export const sendMessage = createAsyncThunk<{ botReply: string }, string>(
  'chatbot/sendMessage',
  async (message: string) => {
    const response = await axios.post('/chatbot/message', { message });
    return { botReply: response.data.reply };
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({ text: action.payload, from: 'user' });
    },
    addBotMessage(state, action: PayloadAction<string>) {
      state.messages.push({ text: action.payload, from: 'bot' });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.messages.push({ text: action.payload.botReply, from: 'bot' });
    });
  },
});

export const { addUserMessage, addBotMessage } = chatbotSlice.actions;
export const selectChatMessages = (state: { chatbot: ChatbotState }) => state.chatbot.messages;

export default chatbotSlice.reducer;
