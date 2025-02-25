import { Server } from "https://deno.land/x/socket_io@0.2.1/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { insertMessage } from "../models/Message.ts";
import { Document } from "npm:langchain/document";
import { cleanText, splitTextIntoChunks } from "../utils/textUtils.ts";

/**
 * Create and emit an AI message to the user.
 * @author Sriram Sundar
 *
 * @async
 * @param {Server} io - The Socket.IO server instance.
 * @param {string} userSocketId - The socket ID of the user.
 * @param {ObjectId} senderId - The ObjectId of the sender (AI Model).
 * @param {ObjectId} receiverId - The ObjectId of the receiver (User).
 * @param {string} content - The content of the message.
 * @param {boolean} isContextMessage - Whether this is a context message.
 * @returns {Promise<void>}
 */
export const createAndEmitMessage = async (
  io: Server,
  userSocketId: string,
  senderId: ObjectId,
  receiverId: ObjectId,
  content: string,
  isContextMessage: boolean = false
): Promise<void> => {
  try {
    // Create and store the message
    const messageId = await insertMessage({
      sender: senderId,
      receiver: receiverId,
      senderModel: "AIModel",
      receiverModel: "User",
      message: content,
      messageType: isContextMessage ? "context" : "text",
      timeStamp: new Date(),
    });

    console.log(messageId, "messageId");
    console.log(senderId, "senderId");
    console.log(receiverId, "receiverId");
    console.log(content, "content");
    console.log(isContextMessage, "isContextMessage");

    // Emit the message to the user if they're connected
    if (userSocketId) {
      io.to(userSocketId).emit("receive-message", {
        _id: messageId.toString(),
        sender: senderId.toString(),
        receiver: receiverId.toString(),
        senderModel: "AIModel",
        receiverModel: "User",
        content,
        isAI: true,
        messageType: isContextMessage ? "context" : "text",
        timeStamp: new Date(),
      });
    }
  } catch (error) {
    console.error("Error creating/emitting message:", error);
  }
};

/**
 * Handle sending context documents as messages.
 * @author Sriram Sundar
 *
 * @async
 * @param {Server} io - The Socket.IO server instance.
 * @param {string} userSocketId - The socket ID of the user.
 * @param {ObjectId} senderId - The ObjectId of the sender (AI Model).
 * @param {ObjectId} receiverId - The ObjectId of the receiver (User).
 * @param {Document[]} contextDocuments - The retrieved context documents.
 * @returns {Promise<void>}
 */
export const handleContextMessages = async (
  io: Server,
  userSocketId: string,
  senderId: ObjectId,
  receiverId: ObjectId,
  contextDocuments: Document[]
): Promise<void> => {
  try {
    const maxMessageLength = 1000;

    for (let i = 0; i < contextDocuments.length; i++) {
      const doc = contextDocuments[i];
      const cleanedPageContent = cleanText(doc.pageContent);
      const messageHeader = `[Excerpt ${i + 1}]\n`;

      const contentChunks = splitTextIntoChunks(
        cleanedPageContent,
        maxMessageLength - messageHeader.length
      );

      let isFirstChunk = true;

      for (const chunk of contentChunks) {
        const chunkContent = (isFirstChunk ? messageHeader : "") + chunk;
        isFirstChunk = false;

        await createAndEmitMessage(
          io,
          userSocketId,
          senderId,
          receiverId,
          chunkContent,
          true
        );
      }
    }
  } catch (error) {
    console.error("Error handling context messages:", error);
  }
};
