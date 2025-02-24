import * as UserModel from "./models/User.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

/**
 * A mutable dependency container that exports functions for use
 * by controllers. This allows these functions to be stubbed in tests.
 * @author Sriram Sundar
 *
 * @type {{ findUserByEmail: any; insertUser: any; findUserById: any; compare: any; }}
 */
export const deps = {
  findUserByEmail: UserModel.findUserByEmail,
  insertUser: UserModel.insertUser,
  findUserById: UserModel.findUserById,
  compare: bcrypt.compare,
};
