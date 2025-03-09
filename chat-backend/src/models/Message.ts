<<<<<<< HEAD
<<<<<<< HEAD
import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { db } from "../db/mongo.ts";

/**
 * Message Schema Interface
 * @author Sriram Sundar
 *
 * @interface MessageSchema
 * @typedef {MessageSchema}
=======
=======
import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
>>>>>>> ae7a34f (did message related stuff)
import { db } from "../db/mongo.ts";

/**
 * Message Schema Interface
<<<<<<< HEAD
>>>>>>> a49f639 (added testing capabilities with docker and relevant useful deno tasks)
=======
 * @author Sriram Sundar
 *
 * @interface MessageSchema
 * @typedef {MessageSchema}
>>>>>>> ae7a34f (did message related stuff)
 */
interface MessageSchema {
  _id: ObjectId;
  sender: ObjectId;
  receiver: ObjectId;
  senderModel: "User" | "AIModel";
  receiverModel: "User" | "AIModel";
  message: string;
<<<<<<< HEAD
<<<<<<< HEAD
  messageType: "text" | "file" | "context";
  timeStamp: Date;
}


const Message: Collection<MessageSchema> =
  db.collection<MessageSchema>("messages");

/**
 * Inserts a message into the database
 * @author Sriram Sundar
 *
 * @async
 * @param {Omit<MessageSchema, "_id">} message
 * @returns {Promise<ObjectId>}
=======
=======
  messageType: "text" | "file" | "context";
>>>>>>> ae7a34f (did message related stuff)
  timeStamp: Date;
}


const Message: Collection<MessageSchema> =
  db.collection<MessageSchema>("messages");

/**
 * Inserts a message into the database
<<<<<<< HEAD
>>>>>>> a49f639 (added testing capabilities with docker and relevant useful deno tasks)
=======
 * @author Sriram Sundar
 *
 * @async
 * @param {Omit<MessageSchema, "_id">} message
 * @returns {Promise<ObjectId>}
>>>>>>> ae7a34f (did message related stuff)
 */
const insertMessage = async (
  message: Omit<MessageSchema, "_id">
): Promise<ObjectId> => {
  const insertId = await Message.insertOne({
    ...message,
    timeStamp: new Date(),
  });
  return insertId;
};

/**
 * Fetches messages between a user and an AI model
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ae7a34f (did message related stuff)
 * @author Sriram Sundar
 *
 * @async
 * @param {string} userId
 * @param {string} aiModelId
 * @returns {Promise<MessageSchema[]>}
<<<<<<< HEAD
=======
>>>>>>> a49f639 (added testing capabilities with docker and relevant useful deno tasks)
=======
>>>>>>> ae7a34f (did message related stuff)
 */
const fetchMessages = async (
  userId: string,
  aiModelId: string
): Promise<MessageSchema[]> => {
  return await Message.find({
    $or: [
      {
        sender: new ObjectId(userId),
        receiver: new ObjectId(aiModelId),
        senderModel: "User",
        receiverModel: "AIModel",
      },
      {
        sender: new ObjectId(aiModelId),
        receiver: new ObjectId(userId),
        senderModel: "AIModel",
        receiverModel: "User",
      },
    ],
  })
    .sort({ timeStamp: 1 })
    .toArray();
};

export { Message, insertMessage, fetchMessages };
export type { MessageSchema };
