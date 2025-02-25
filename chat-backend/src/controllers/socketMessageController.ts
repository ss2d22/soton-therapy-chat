import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.1/mod.ts";
import { insertMessage } from "../models/Message.ts";
import { findAIModelById } from "../models/AIModel.ts";
import aiService from "../services/AiService.ts";

/**
 * Interface for incoming message structure.
 */
interface IncomingMessage {
  sender: string;
  receiver: string;
  content: string;
  receiverModel: "User" | "AIModel";
  isAI: boolean;
  messageType: "text" | "file" | "context";
}

/**
 * Handles incoming messages from users.
 *
 * This version first ensures that the incoming data is parsed into an object.
 *
 * @param io - The Socket.IO server instance.
 * @param userSocketMap - Map of user IDs to socket IDs.
 * @param message - The incoming message (object or JSON string).
 */
const handleSendMessage = async (
  io: Server,
  userSocketMap: Map<string, string>,
  message: unknown
): Promise<void> => {
  let parsedMessage: IncomingMessage;

  if (typeof message === "string") {
    try {
      parsedMessage = JSON.parse(message);
    } catch (err) {
      console.error("Failed to parse message as JSON:", err);
      return;
    }
  } else {
    parsedMessage = message as IncomingMessage;
  }

  console.log("Received message: ", parsedMessage);
  const { sender, content, receiver, receiverModel, isAI, messageType } =
    parsedMessage;

  console.log("Sender: ", sender);
  console.log("Content: ", content);
  console.log("Receiver: ", receiver);
  console.log("Receiver Model: ", receiverModel);
  console.log("Is AI: ", isAI);
  console.log("Message Type: ", messageType);

  try {
    const aiModel = await findAIModelById(receiver);
    if (!aiModel) {
      throw new Error("AI Model not found");
    }

    // Insert the incoming message into the database.
    const messageId = await insertMessage({
      sender: new ObjectId(sender),
      receiver: new ObjectId(receiver),
      senderModel: "User",
      receiverModel: "AIModel",
      message: content,
      messageType: messageType,
      timeStamp: new Date(),
    });

    // Emit the message back to the user if connected.
    console.log("User Socket Map: ", userSocketMap.entries());
    console.log(sender, "SENDER");

    const userSocketId = userSocketMap.get(sender);
    console.log("User Socket ID: ", userSocketId);

    if (userSocketId) {
      io.to(userSocketId).emit("receive-message", {
        _id: messageId.toString(),
        sender,
        receiver,
        senderModel: "User",
        receiverModel: "AIModel",
        content,
        isAI: false,
        messageType,
        timeStamp: new Date(),
      });
    }

    // Trigger the AI response.
    await aiService.handleAIResponse(
      io,
      userSocketMap,
      new ObjectId(sender),
      aiModel,
      content
    );
  } catch (error) {
    console.error("Error handling message:", error);
  }
};

export { handleSendMessage };
export type { IncomingMessage };
