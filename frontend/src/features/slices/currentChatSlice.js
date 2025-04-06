import { createSlice } from "@reduxjs/toolkit";
import { getMessages } from "../actions/conversationActions";

const initialState = {
  conversationMetaData: null,
  messages: [],
  isSuccess: false,
  isLoading: false,
  error: null,
};

const currentChatSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    setCurrentChatMetaData: (state, action) => {
      state.conversationMetaData = action.payload;
    },
    appendMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.isSuccess = false;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isSuccess = false;
        console.log("Something is wrong with the get message api ...");
        alert("Something is wrong with the get message api  Its rejected ...");
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.messages = action.payload.data;

        console.log("Messages from an api ", action.payload.data);
      });
  },
});

export const { clearMessages, setCurrentChatMetaData, appendMessage } =
  currentChatSlice.actions;

export default currentChatSlice.reducer;
