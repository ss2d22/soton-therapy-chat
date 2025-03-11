import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    BACKEND_URL,
    GET_ACTIVE_MODELS_URL
} from "@/constants";

/**
 * textbook related endpoints for the apis from the backend to be used
 * in the frontend using react redux
 * @author Sriram Sundar
 *
 */
export const modelsApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        credentials: "include",
    }),
    reducerPath: "models",
    tagTypes: [],
    endpoints: (build) => ({
        getModelsList: build.query({
            query: (payload) => ({
                url: GET_ACTIVE_MODELS_URL,
                method: "GET",
                body: payload as string,
            }),
        }),
    }),
});

/**
 * hooks to use the apis defined in this file using
 * react redux
 * @author Sriram Sundar
 *
 */
export const {
    useGetModelsListQuery,
} = modelsApi;
