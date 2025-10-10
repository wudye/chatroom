import { createSlice } from '@reduxjs/toolkit';
import type { UserInfo } from '../api/types';

const initialStates = {
  isLoggedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    groupNum: 0,
    friendNum: 0,
    userRole: "",
  } as UserInfo
};
const authSlice = createSlice({
  name: 'auth',
  initialState: initialStates,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth');
      state.isLoggedIn = false;
    },
      initializeAuthState(state) {
      const accessToken = localStorage.getItem('accessToken');
      state.isLoggedIn = !!accessToken; // Set to true if token exists
    },

    setUserRole:(state, action) => {
      state.user.userRole = action.payload;
    }
    
  },
});

export const { login, logout ,  initializeAuthState, setUserRole } = authSlice.actions;
export default authSlice.reducer;