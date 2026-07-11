import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/auth.type";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStarted(state) {
      state.isLoading = true;
      state.error = null;
    },
    authSucceeded(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.isInitialized = true;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    sessionRestored(state, action: PayloadAction<User | null>) {
      state.isInitialized = true;
      state.isAuthenticated = Boolean(action.payload);
      state.user = action.payload;
    },
    signedOut(state) {
      state.isLoading = false;
      state.isInitialized = true;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    profileUpdated(state, action: PayloadAction<{ name: string; email: string; avatar?: string }>) {
      if (state.user) {
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
        state.user.avatar = action.payload.avatar;
      }
    },
  },
});

export const { authStarted, authSucceeded, authFailed, sessionRestored, signedOut, profileUpdated } = authSlice.actions;
export default authSlice.reducer;
