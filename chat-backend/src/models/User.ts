import { Collection } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { db } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
/**
 *  Schema for the user collection in the MongoDB instance
 * @author Sriram Sundar
 *
 * @interface UserSchema
 * @typedef {UserSchema}
 */
interface UserSchema {
  /**
   * object id of the user in the MongoDB instance
   * @author Sriram Sundar
   *
   * @type {ObjectId}
   */
  _id: ObjectId;
  /**
   * email of the user
   * @author Sriram Sundar
   *
   * @type {string}
   */
  email: string;
  /**
   * hashed password of the user
   * @author Sriram Sundar
   *
   * @type {string}
   */
  password: string;
  /**
   * first name of the user
   * @author Sriram Sundar
   *
   * @type {?string}
   */
  firstName?: string;
  /**
   * last name of the user
   * @author Sriram Sundar
   *
   * @type {?string}
   */
  lastName?: string;
  /**
   * avatar of the user
   * @author Sriram Sundar
   *
   * @type {?string}
   */
  avatar?: string;
  /**
   * theme the user picked
   * @author Sriram Sundar
   *
   * @type {?number}
   */
  theme?: number;
  /**
   * whether the user has configured their profile or not
   * @author Sriram Sundar
   *
   * @type {?boolean}
   */
  configuredProfile?: boolean;
}

/**
 * Collection instance for the user collection in the MongoDB instance
 * @author Sriram Sundar
 *
 * @type {Collection<UserSchema>}
 */
const User: Collection<UserSchema> = db.collection<UserSchema>("users");

export { User };
export type { UserSchema };
