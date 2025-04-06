import { createSlice } from "@reduxjs/toolkit";
import { getChatPreviews } from "../actions/previousChatActions";

const initialState = {
  previousChatPreview: [],
  isSuccess: false,
  isError: false,
};

const previousChatSlice = createSlice({
  name: "previousChatHistoryPreview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChatPreviews.pending, (state) => {
      state.isSuccess = false;
    });
    builder.addCase(getChatPreviews.fulfilled, (state, action) => {
      state.isSuccess = true;
      console.log("We came in getChatPreviews ", action.payload.data);
      alert("We came in getChatPreviews");
      state.previousChatPreview = action.payload.data;
    });
    builder.addCase(getChatPreviews.rejected, (state) => {
      alert("We came in getChatPreviews and rejected");
      state.isSuccess = false;
    });
  },
});

export default previousChatSlice.reducer;
