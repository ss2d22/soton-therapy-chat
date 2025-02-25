import { Server } from "https://deno.land/x/socket_io@0.2.1/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { AIModelSchema } from "../models/AIModel.ts";
import { getChatHistory } from "./chatHistoryService.ts";
import { createHistoryRetriever, createQAChain } from "./chainService.ts";
import {
  createAndEmitMessage,
  handleContextMessages,
} from "./messageService.ts";

/**
 * Handles AI response generation.
 *
 * @param io - The Socket.IO server instance.
 * @param userSocketMap - Map of user IDs to socket IDs.
 * @param sender - The user’s ObjectId.
 * @param aiModel - The selected AI model (includes model name, temperature, system prompt, etc.).
 * @param content - The user’s message.
 */
const aiService = {
  handleAIResponse: async (
    io: Server,
    userSocketMap: Map<string, string>,
    sender: ObjectId,
    aiModel: AIModelSchema,
    content: string
  ): Promise<void> => {
    try {
      // Get the latest chat history using the AI model’s _id as identifier
      const chatHistory = await getChatHistory(sender, aiModel._id);

      // Use a history-aware retriever to get relevant documents.
      // Pass in the selected model and its temperature.
      const { query, documents } = await createHistoryRetriever(
        content,
        chatHistory,
        aiModel.model,
        aiModel.temperature
      );

      console.log("Query: ", query);
      console.log("Documents: ", documents);

      // Generate a response using the QA chain with the chosen model, temperature, and system prompt.
      const response = await createQAChain(
        aiModel.model,
        aiModel.temperature,
        aiModel.systemPrompt,
        query,
        chatHistory,
        documents
      );

      console.log("Response: ", response);

      // Look up the user’s socket ID.
      const userSocketId = userSocketMap.get(sender.toString());
      console.log("User Socket ID: ", userSocketId);

      if (userSocketId) {
        // Emit the AI response message.
        await createAndEmitMessage(
          io,
          userSocketId,
          aiModel._id,
          sender,
          response.answer
        );

        // If context documents were retrieved, send them as context messages.
        if (Array.isArray(response.context) && response.context.length > 0) {
          await handleContextMessages(
            io,
            userSocketId,
            aiModel._id,
            sender,
            response.context
          );
        }
      }
    } catch (error) {
      console.error("Error handling AI response:", error);
    }
  },
};

export default aiService;
