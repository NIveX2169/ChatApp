import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const getChatPreviews = createAsyncThunk(
  "previousChatHistories",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/conversation-relation/user/${userId}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      // Return custom error message from backend if present
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue(
          "An error occurred during login. Please try again."
        );
      }
    }
  }
);
