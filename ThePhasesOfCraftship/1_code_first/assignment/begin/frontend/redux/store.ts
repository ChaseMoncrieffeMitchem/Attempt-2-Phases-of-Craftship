import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Adjust path if needed

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Types for useSelector and useDispatch hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
