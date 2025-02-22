import { db } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

export interface UserSchema {
  _id?: ObjectId;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  theme?: number;
  configuredProfile?: boolean;
}

export const User = db.collection<UserSchema>("users");

