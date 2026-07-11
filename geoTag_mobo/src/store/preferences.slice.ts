import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import type { Language } from '../utils/localization';

const LANGUAGE_STORE_KEY = 'app_language';
const THEME_STORE_KEY = 'app_theme';

export interface PreferencesState {
  language: Language;
  isLangInitialized: boolean;
  theme: 'light' | 'dark';
}

const initialState: PreferencesState = {
  language: 'en',
  isLangInitialized: false,
  theme: 'light',
};

// Async thunk to load saved language on startup
export const bootstrapLanguage = createAsyncThunk(
  'preferences/bootstrapLanguage',
  async () => {
    try {
      const savedLang = await SecureStore.getItemAsync(LANGUAGE_STORE_KEY);
      if (savedLang === 'en' || savedLang === 'hi' || savedLang === 'es') {
        return savedLang as Language;
      }
    } catch {
      // Ignore reading error
    }
    return 'en' as Language;
  }
);

// Async thunk to save language changes
export const changeLanguage = createAsyncThunk(
  'preferences/changeLanguage',
  async (lang: Language) => {
    try {
      await SecureStore.setItemAsync(LANGUAGE_STORE_KEY, lang);
    } catch {
      // Ignore writing error
    }
    return lang;
  }
);

// Async thunk to load saved theme on startup
export const bootstrapTheme = createAsyncThunk(
  'preferences/bootstrapTheme',
  async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync(THEME_STORE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme as 'light' | 'dark';
      }
    } catch {
      // Ignore reading error
    }
    return 'light' as 'light' | 'dark';
  }
);

// Async thunk to save theme changes
export const changeTheme = createAsyncThunk(
  'preferences/changeTheme',
  async (theme: 'light' | 'dark') => {
    try {
      await SecureStore.setItemAsync(THEME_STORE_KEY, theme);
    } catch {
      // Ignore writing error
    }
    return theme;
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapLanguage.fulfilled, (state, action: PayloadAction<Language>) => {
        state.language = action.payload;
        state.isLangInitialized = true;
      })
      .addCase(changeLanguage.fulfilled, (state, action: PayloadAction<Language>) => {
        state.language = action.payload;
      })
      .addCase(bootstrapTheme.fulfilled, (state, action: PayloadAction<'light' | 'dark'>) => {
        state.theme = action.payload;
      })
      .addCase(changeTheme.fulfilled, (state, action: PayloadAction<'light' | 'dark'>) => {
        state.theme = action.payload;
      });
  },
});

export default preferencesSlice.reducer;
