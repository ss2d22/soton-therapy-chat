import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { Message } from "../models/Message.ts";
import {
  HumanMessage,
  AIMessage,
  BaseMessage,
} from "npm:@langchain/core/messages";

/**
 * Retrieves chat history between a user and an AI model
 * @author Sriram Sundar
 *
 * @async
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} aiModelId - AI Model ID
 * @returns {Promise<BaseMessage[]>} Formatted chat history for the AI
 */
const getChatHistory = async (
  userId: ObjectId,
  aiModelId: ObjectId
): Promise<BaseMessage[]> => {
  try {
    // Query messages excluding context messages
    const messages = await Message.find({
      $or: [
        {
          sender: userId,
          receiver: aiModelId,
          senderModel: "User",
          receiverModel: "AIModel",
        },
        {
          sender: aiModelId,
          receiver: userId,
          senderModel: "AIModel",
          receiverModel: "User",
        },
      ],
      messageType: { $ne: "context" },
    })
      .sort({ timeStamp: -1 })
      .limit(10)
      .toArray();

    // Format messages for the LangChain AI system - convert to BaseMessage objects
    return messages.reverse().map((msg) => {
      if (msg.sender.toString() === userId.toString()) {
        return new HumanMessage(msg.message);
      } else {
        return new AIMessage(msg.message);
      }
    });
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
};

export { getChatHistory };
