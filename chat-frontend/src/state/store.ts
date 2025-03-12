import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "@/state/slices/authSlice";
import chatReducer from "@/state/slices/chatSlice"
import {modelsApi} from "@/state/api/modelApi.ts";
import {messagesApi} from "@/state/api/messagesApi.ts";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [modelsApi.reducerPath]: modelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(modelsApi.middleware).concat(messagesApi.middleware),
});
