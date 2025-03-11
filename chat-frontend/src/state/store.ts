import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "@/state/slices/authSlice";
//import modelsReducer from "@state/slices/modelsSli"
import {modelsApi} from "@/state/api/modelApi.ts";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [modelsApi.reducerPath]: modelsApi.reducer,
    auth: authReducer,
    //modelsApi: modelsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(modelsApi.middleware),
});
