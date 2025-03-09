// Import the RTK Query methods from the React-specific entry point
import {
  FECTH_USER_INFO_URL,
  LOGIN_URL,
  LOGOUT_URL,
  SIGNUP_URL,
} from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const authApi = createApi({
  reducerPath: "main",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/authentication" }),
  endpoints: (builder) => ({
    postSignUp: builder.mutation({
      query: (payload) => ({
        url: SIGNUP_URL,
        method: "POST",
        body: payload as string,
      }),
    }),
    postSignIn: builder.mutation({
      query: (payload) => ({
        url: LOGIN_URL,
        method: "POST",
        body: payload as string,
      }),
    }),
    postLogOut: builder.mutation({
      query: () => ({
        url: LOGOUT_URL,
        method: "POST",
      }),
    }),
    getFetchUserInfo: builder.query({
      query: () => ({
        url: FECTH_USER_INFO_URL,
        method: "GET",
      }),
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  usePostSignUpMutation,
  usePostSignInMutation,
  usePostLogOutMutation,
  useGetFetchUserInfoQuery,
} = authApi;
