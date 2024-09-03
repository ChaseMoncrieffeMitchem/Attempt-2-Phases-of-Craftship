// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    logoutUser: (state) => {
      return { ...initialState }
    }
  },
});

export const { setUserDetails, logoutUser } = userSlice.actions;
export default userSlice.reducer;
