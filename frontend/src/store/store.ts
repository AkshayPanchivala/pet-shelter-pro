import { configureStore } from '@reduxjs/toolkit';
import { authReducer, petReducer, applicationReducer } from './slices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
    applications: applicationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
