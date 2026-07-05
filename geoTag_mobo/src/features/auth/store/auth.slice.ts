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
  },
});

export const { authStarted, authSucceeded, authFailed, sessionRestored, signedOut } = authSlice.actions;
export default authSlice.reducer;
