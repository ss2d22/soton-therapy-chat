/**
 * email of the user
 * @author Sriram Sundar
 *
 * @typedef {email}
 */
declare type email = string;

/**
 * password of the user
 * @author Sriram Sundar
 *
 * @typedef {password}
 */
declare type password = string;

/**
 * request body for the signUp controller
 * @author Sriram Sundar
 *
 * @export
 * @interface SignUpBody
 * @typedef {SignUpBody}
 */
export interface SignUpBody {
  /**
   * email of the user signing up
   * @author Sriram Sundar
   *
   * @type {?password}
   */
  email?: email;
  /**
   * password of the user signing up
   * @author Sriram Sundar
   *
   * @type {?password}
   */
  password?: password;
}

/**
 * request body for the signIn controller
 * @author Sriram Sundar
 *
 * @export
 * @interface SignInBody
 * @typedef {SignInBody}
 */
export interface SignInBody {
  /**
   * email of the user signing in
   * @author Sriram Sundar
   *
   * @type {?email}
   */
  email?: email;
  /**
   * password of the user signing in
   * @author Sriram Sundar
   *
   * @type {?password}
   */
  password?: password;
}
