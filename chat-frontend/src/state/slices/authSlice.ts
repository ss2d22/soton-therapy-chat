import { AuthState, UserInfo } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@reduxjs/toolkit/query";

const initialState: AuthState = {
  userInfo: undefined,
};

export const authSlice = createSlice({
  name: "authSlice",
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

export const selectUserInfo = (state: RootState) => state.authSlice.userInfo;
export const selectUserFirstName = (state: RootState) =>
  state.authSlice.userInfo.firstName;

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
