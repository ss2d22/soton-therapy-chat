// cosnstants fo api endpoint urls

export const BACKEND_URL: string = import.meta.env.BACKEND_BASE_URL as string;
export const AUTH_URL: string = BACKEND_URL + "/api/authentication";
export const FECTH_USER_INFO_URL: string = AUTH_URL + "/fetchuserinfo";
export const LOGIN_URL: string = AUTH_URL + "/signin";
export const SIGNUP_URL: string = AUTH_URL + "/signup";
export const LOGOUT_URL: string = AUTH_URL + "/signout";
