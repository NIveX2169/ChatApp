import { createSlice } from "@reduxjs/toolkit";
import { login } from "../actions/authActions";
//initial state
const initialState = {
  isLoggedIn: false,
  userData: null,
  status: null,
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "PENDING";
      })
      .addCase(login.rejected, (state) => {
        state.status = "FAILED";
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("payload in fulfilled:", action.payload);

        state.status = "SUCCESS";
        state.userData = action.payload.user;
        state.isLoggedIn = true;
      });
  },
});

export default authSlice.reducer;
