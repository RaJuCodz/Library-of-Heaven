import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: "user",
  },
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
      //   state.role = action.payload.role;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = "user";
    },
    setRole: (state, action) => {
      state.role = action.payload.role;
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;
