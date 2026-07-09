import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import type { Language } from '../utils/localization';

const LANGUAGE_STORE_KEY = 'app_language';

export interface PreferencesState {
  language: Language;
  isLangInitialized: boolean;
}

const initialState: PreferencesState = {
  language: 'en',
  isLangInitialized: false,
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
      });
  },
});

export default preferencesSlice.reducer;
