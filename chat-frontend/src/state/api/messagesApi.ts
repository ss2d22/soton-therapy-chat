import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL, GET_MESSAGES_URL } from "@/constants";


export const messagesApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        credentials: "include",
    }),
    reducerPath: "messages",
    tagTypes: [],
    endpoints: (build) => ({
        postFetchMessages: build.mutation({
            query: (payload) => ({
                url: GET_MESSAGES_URL,
                method: "POST",
                body: payload as string,
            }),
        }),
    }),
});

export const { usePostFetchMessagesMutation } = messagesApi;
