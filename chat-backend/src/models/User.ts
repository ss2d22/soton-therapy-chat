import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { db } from "../db/mongo.ts";

import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

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
 * Collection instance for the users collection in the MongoDB instance
 * @author Sriram Sundar
 *
 * @type {Collection<UserSchema>}
 */
const User: Collection<UserSchema> = db.collection<UserSchema>("users");

// create an index to ensure that the email is unique
await User.createIndexes({
  indexes: [
    {
      key: { email: 1 },
      unique: true,
      name: "unique_email_index",
    },
  ],
});

/**
 * Inserts a user into the users collection
 * @author Sriram Sundar
 *
 * @async
 * @param {Omit<UserSchema, "_id">} user
 * @returns {Promise<ObjectId>} insertId
 */
const insertUser = async (user: Omit<UserSchema, "_id">): Promise<ObjectId> => {
  const hashedPassword: string = await hash(user.password);
  const insertId: ObjectId = await User.insertOne({
    ...user,
    password: hashedPassword,
  });
  return insertId;
};

/**
 * finds a user by their email in the users collection
 * @author Sriram Sundar
 *
 * @async
 * @param {string} email
 * @returns {Promise<UserSchema | undefined>} user
 */
const findUserByEmail = async (
  email: string
): Promise<UserSchema | undefined> => {
  return await User.findOne({ email });
};

/**
 * find a user by their object id in the users collection
 * @author Sriram Sundar
 *
 * @async
 * @param {string} userId
 * @returns {Promise<UserSchema | undefined>}
 */
const findUserById = async (
  userId: string
): Promise<UserSchema | undefined> => {
  return await User.findOne({ _id: new ObjectId(userId) });
};

export { User, insertUser, findUserByEmail, findUserById };
export type { UserSchema };
