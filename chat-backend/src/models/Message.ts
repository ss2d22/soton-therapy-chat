import { db } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";

/**
 * Message Schema Interface
 */
interface MessageSchema {
  _id: ObjectId;
  sender: ObjectId;
  receiver: ObjectId;
  senderModel: "User" | "AIModel";
  receiverModel: "User" | "AIModel";
  message: string;
  timeStamp: Date;
}

/**
 * Message Collection
 */
const Message = db.collection<MessageSchema>("messages");

/**
 * Inserts a message into the database
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
