import { createSlice } from "@reduxjs/toolkit";



const userSlice = createSlice({
  name: "user",
  initialState: {
    User: null,
    accessToken: null,
  },
  reducers: {
    setUser: (state, action) => {
      // Accept either a user object or an object { user, accessToken }
      if (action.payload?.user) {
        state.User = action.payload.user;
        state.accessToken = action.payload.accessToken || state.accessToken;
      } else {
        state.User = action.payload;
      }
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.User = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, setToken, clearAuth } = userSlice.actions;
export default userSlice.reducer;


