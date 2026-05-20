import { configureStore } from "@reduxjs/toolkit";
import gameReducer from './gameSlice';

export const store = configureStore({
  reducer: {
    // Les reducers seront ajoutés ici
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
