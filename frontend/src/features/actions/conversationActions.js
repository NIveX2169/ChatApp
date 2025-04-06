import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const getMessages = createAsyncThunk(
  "conversation/messages",
  async (participants, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/messages/get-message`,
        {
          ...participants,
        },
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
