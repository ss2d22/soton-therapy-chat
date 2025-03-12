import {ReactNode} from "react";
import {authApi} from "@/state/api/authApi.ts";
import {store} from "@/state/store.ts";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

declare type email = string;

declare type firstName = string;

declare type lastName = string;

declare type password = string;

declare type id = string;

declare type avatar = string;

declare type theme = number;

declare type configuredProfile = boolean;

/*
 * Information of the authenticated user
 */
export interface UserInfo {
  id: id;
  email: email;
  firstName: firstName;
  lastName: lastName;
  avatar: avatar;
  theme: theme;
  configuredProfile: configuredProfile;
}

export interface SignInPayload {
  email: email;
  password: password;
}

export interface SignUpPayload {
  email: email;
  passwaord: password;
}

export interface AuthState {
  userInfo: UserInfo | undefined;
}

export interface RouterProps {
  children: ReactNode;
}


export interface RootState {
  /**
   * Auth state in the store from auth slice
   * @author Sriram Sundar
   *
   * @type {AuthState}
   */
  auth: AuthState;

  /**
   * Authentication API reducer path in store
   * @author Sriram Sundar
   *
   * @type {ReturnType<typeof authenticationApi.reducer>}
   */
  [authApi.reducerPath]: ReturnType<typeof authApi.reducer>;

  /**
   * Chat state in the store from chat slice
   * @author Sriram Sundar
   *
   * @type {ChatState}
   */
  //chat: ChatState;

  /**
   * textbooksApi reducer path in store
   * @author Sriram Sundar
   *
   * @type {ReturnType<typeof chatApi.reducer>}
   */
  //[textbooksApi.reducerPath]?: ReturnType<typeof textbooksApi.reducer>;
}

/**
 * AppDispatch type for the store dispatch function
 * @author Sriram Sundar
 *
 * @export
 * @typedef {AppDispatch}
 */
export type AppDispatch = typeof store.dispatch;

/**
 * RouterProps for AuthRoute nd Private route functions
 * @author Sriram Sundar
 *
 * @export
 * @interface RouterProps
 * @typedef {RouterProps}
 */
export interface RouterProps {
  /**
   * children passed in to be rendered if conditions are met
   * @author Sriram Sundar
   *
   * @type {ReactNode}
   */
  children: ReactNode;
}

declare interface ErrorResponse {
  error: FetchBaseQueryError | SerializedError;
}

declare interface AuthResponse {
  data: {
    user: UserInfo;
  };
}


export interface signOut {
  data: {
    message: string;
  };
}

export type signOutResponse = signOut | ErrorResponse;


export type AuthApiResponse = AuthResponse | ErrorResponse;

declare interface fetchUserInfoResponse {

  isSuccess: boolean;

  data: {
    user: UserInfo;
  };
}

export interface aiModelDetails {
  id : string;
  name : string;
  description : string;
}

export type modelType = "User" | "AIModel";

export type messageType = "text" | "file" | "context";


export interface ChatMessage {
  sender : number;
  receiver : number;
  timeStamp : Date;
  senderModel : modelType;
  receiverModel : modelType;
  messageType : messageType;
  isAI : boolean;
}

export interface ChatState {
  isLoading: boolean;
  error: string | null;
  userModels : aiModelDetails[] | undefined;
  selectedChatMessages: ChatMessage[];
  selectedModel : aiModelDetails | undefined;
}