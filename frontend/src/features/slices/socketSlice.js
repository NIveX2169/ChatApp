import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

//initial state
const initialState = {
  socket: null,
  isConnected: false,
};

const socketSlice = createSlice({
  name: "Socket",
  initialState,
  reducers: {
    connectSocket: (state) => {
      if (!state.socket) {
        console.log("Connecting to WebSocket at:", "http://localhost:8080");
        state.socket = io("http://localhost:8080", {
          transports: ["websocket"], // Force WebSocket mode
          autoConnect: false,
          withCredentials: true,
        });
        state.socket.connect();
        state.isConnected = true;
      }
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
        state.isConnected = false;
      }
    },
  },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
