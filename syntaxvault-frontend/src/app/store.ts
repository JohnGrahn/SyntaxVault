// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import snippetsReducer from '../features/snippets/snippetsSlice';
import tagsReducer from '../features/tags/tagsSlice';
import collectionsReducer from '../features/collections/collectionsSlice'; // Import Collections Reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    snippets: snippetsReducer,
    tags: tagsReducer,
    collections: collectionsReducer, // Add to store
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;