import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPasword",
  initialState: initialState,
  reducers: {
    setEmail(state, value) {
      state.email = value.payload;
    },
  },
});

export const { setEmail } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
