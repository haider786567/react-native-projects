import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/auth.slice';

import preferencesReducer from './preferences.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;