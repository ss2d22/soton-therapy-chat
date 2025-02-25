import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { db } from "../db/mongo.ts";

/**
 * Message Schema Interface
 * @author Sriram Sundar
 *
 * @interface MessageSchema
 * @typedef {MessageSchema}
 */
interface MessageSchema {
  _id: ObjectId;
  sender: ObjectId;
  receiver: ObjectId;
  senderModel: "User" | "AIModel";
  receiverModel: "User" | "AIModel";
  message: string;
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
 * @author Sriram Sundar
 *
 * @async
 * @param {string} userId
 * @param {string} aiModelId
 * @returns {Promise<MessageSchema[]>}
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
