import { AuthState, UserInfo, RootState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  userInfo: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (
      state: AuthState,
      action: PayloadAction<UserInfo | undefined>
    ) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state: AuthState) => {
      state.userInfo = undefined;
    },
  },
});

export const selectUserInfo = (state: RootState) => state.auth.userInfo;

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
