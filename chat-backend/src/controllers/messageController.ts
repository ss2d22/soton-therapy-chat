import { Context } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
<<<<<<< HEAD
import { Message } from "../models/Message.ts";
import { db } from "../db/mongo.ts";
import { escapeSpecialChars } from "../utils/textUtils.ts";

/**
 * Fetches messages between a user and an AI model.
 * Uses userId from JWT middleware.
=======
import { Message, MessageSchema } from "../models/Message.ts";
import { Body } from "https://deno.land/x/oak@v17.1.4/body.ts";

/**
 * Fetches messages between a user and an AI model.
 * Uses userId from JWT middleware instead of request body.
>>>>>>> 4ebe96c (added unit tests with dependency injection)
 * @author Sriram Sundar
 *
 * @async
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
const fetchMessages = async (ctx: Context): Promise<void> => {
  try {
    const userId: string = ctx.state.userId;

    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No body provided" };
      return;
    }

<<<<<<< HEAD
    const body = await ctx.request.body.json();

    const aiModelId: string = body.aiModelId;
    const receiverModel: "User" | "AIModel" = body.receiverModel;
=======
    const body: Body = ctx.request.body;
    console.log(body);

    const data = await body.json();

    const aiModelId: string = data.aiModelId;
    const receiverModel: "User" | "AIModel" = data.receiverModel;
>>>>>>> 4ebe96c (added unit tests with dependency injection)

    if (!aiModelId || !receiverModel) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "AI Model ID and receiver model are required.",
      };
      return;
    }

    if (receiverModel !== "User" && receiverModel !== "AIModel") {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Invalid receiver model. Allowed values: 'User' or 'AIModel'.",
      };
      return;
    }

    const senderId = new ObjectId(userId);
    const modelId = new ObjectId(aiModelId);

<<<<<<< HEAD
    // Get messages with filtering
    const messages = await Message.find({
=======
    const messages: MessageSchema[] = await Message.find({
>>>>>>> 4ebe96c (added unit tests with dependency injection)
      $or: [
        {
          sender: senderId,
          receiver: modelId,
          senderModel: "User",
          receiverModel: receiverModel,
        },
        {
          sender: modelId,
          receiver: senderId,
          senderModel: receiverModel,
          receiverModel: "User",
        },
      ],
    })
      .sort({ timeStamp: 1 })
      .toArray();

    ctx.response.status = 200;
    ctx.response.body = { messages };
  } catch (error) {
    console.error("Error in fetchMessages:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};

<<<<<<< HEAD
/**
 * Search for AI models by name or description
 * @author Sriram Sundar
 *
 * @async
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
const searchAIModels = async (ctx: Context): Promise<void> => {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No body provided" };
      return;
    }

    const body = await ctx.request.body.json();
    const { searchTerm } = body;

    if (searchTerm === undefined || searchTerm === null) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Search term is required" };
      return;
    }

    const cleanedSearchTerm = escapeSpecialChars(searchTerm);
    const regex = new RegExp(cleanedSearchTerm, "i");

    const aiModels = await db
      .collection("aimodels")
      .find({
        $or: [{ name: regex }, { description: regex }],
        active: true,
      })
      .toArray();

    // Remove sensitive info
    const safeModels = aiModels.map((model) => {
      const { systemPrompt, ...safeModel } = model;
      return {
        ...safeModel,
        id: safeModel._id.toString(),
      };
    });

    ctx.response.status = 200;
    ctx.response.body = { aiModels: safeModels };
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};

export { fetchMessages, searchAIModels };
=======
export { fetchMessages };
>>>>>>> 4ebe96c (added unit tests with dependency injection)
