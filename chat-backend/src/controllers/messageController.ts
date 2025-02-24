import { Context } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { Message, MessageSchema } from "../models/Message.ts";
import { Body } from "https://deno.land/x/oak@v17.1.4/body.ts";

/**
 * Fetches messages between a user and an AI model.
 * Uses userId from JWT middleware instead of request body.
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

    const body: Body = ctx.request.body;
    console.log(body);

    const data = await body.json();

    const aiModelId: string = data.aiModelId;
    const receiverModel: "User" | "AIModel" = data.receiverModel;

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

    const messages: MessageSchema[] = await Message.find({
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

export { fetchMessages };
