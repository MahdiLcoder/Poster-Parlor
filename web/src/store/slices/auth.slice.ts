import { createSlice } from "@reduxjs/toolkit";

import { AuthInitialState } from "@/types/api-response.type";
import { authApi } from "../api/auth.api";

const initialState: AuthInitialState = {
  user: null,
  accessToken: null, // ⚠️ Consider removing this since cookies handle it
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // ✅ Handle successful login
    builder.addMatcher(
      authApi.endpoints.loginWithGoogle.matchFulfilled,
      (state, action) => {
        const userData = action.payload.data;
        state.user = userData.user;
        state.accessToken = userData.accessToken; // Store for reference only
        state.isAuthenticated = true;
      }
    );

    // ✅ Handle logout - also triggered from baseQueryWithReauth
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    });

    // ✅ Handle token refresh
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, action) => {
        // Update access token reference (cookie is already set by backend)
        state.accessToken = action.payload.data.accessToken;
      }
    );

    // ✅ Handle successful user fetch
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchFulfilled,
      (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
      }
    );

    // ✅ Handle failed /me request
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchRejected,
      (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      }
    );
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
