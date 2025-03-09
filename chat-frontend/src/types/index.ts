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
