import { Context, RouterContext } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { findActiveAIModels, findAIModelById } from "../models/AIModel.ts";
import { db } from "../db/mongo.ts";

/**
 * Fetches all active AI models
 * @author Sriram Sundar
 *
 * @async
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
const getActiveAIModels = async (ctx: Context): Promise<void> => {
  try {
    const aiModels = await findActiveAIModels();

    // Convert models to a user-friendly format and exclude sensitive info
    const modelList = aiModels.map((model) => ({
      id: model._id.toString(),
      name: model.name,
      description: model.description,
    }));

    ctx.response.status = 200;
    ctx.response.body = { aiModels: modelList };
  } catch (error) {
    console.error("Error fetching AI models:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};

/**
 * Gets a specific AI model by ID
 * @author Sriram Sundar
 *
 * @async
 * @param {RouterContext<string>} ctx
 * @returns {Promise<void>}
 */
const getAIModelById = async (ctx: RouterContext<string>): Promise<void> => {
  try {
    const id = ctx.params.id;

    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { error: "AI Model ID is required" };
      return;
    }

    const aiModel = await findAIModelById(id);

    if (!aiModel) {
      ctx.response.status = 404;
      ctx.response.body = { error: "AI Model not found" };
      return;
    }

    // Exclude sensitive information
    const { systemPrompt, ...safeAIModel } = aiModel;

    ctx.response.status = 200;
    ctx.response.body = {
      aiModel: {
        ...safeAIModel,
        id: safeAIModel._id.toString(),
      },
    };
  } catch (error) {
    console.error("Error fetching AI model:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};

/**
 * Gets AI models a user has interacted with
 * @author Sriram Sundar
 *
 * @async
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
const getAIModelsForUser = async (ctx: Context): Promise<void> => {
  try {
    const userId = ctx.state.userId;

    if (!userId) {
      ctx.response.status = 400;
      ctx.response.body = { error: "User ID is required" };
      return;
    }

    // Get body content
    const body = await ctx.request.body.json();

    if (!body) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Request body is required" };
      return;
    }

    const { limit = 10 } = body;

    // Get models the user has interacted with
    const models = await db
      .collection("messages")
      .aggregate([
        {
          $match: {
            $or: [
              {
                sender: new ObjectId(userId),
                senderModel: "User",
                receiverModel: "AIModel",
              },
              {
                receiver: new ObjectId(userId),
                receiverModel: "User",
                senderModel: "AIModel",
              },
            ],
          },
        },
        {
          $sort: { timeStamp: -1 },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$senderModel", "AIModel"] },
                then: "$sender",
                else: "$receiver",
              },
            },
            lastMessageTime: { $first: "$timeStamp" },
          },
        },
        {
          $lookup: {
            from: "aimodels",
            localField: "_id",
            foreignField: "_id",
            as: "modelInfo",
          },
        },
        {
          $unwind: "$modelInfo",
        },
        {
          $project: {
            _id: 1,
            lastMessageTime: 1,
            name: "$modelInfo.name",
            description: "$modelInfo.description",
          },
        },
        {
          $sort: { lastMessageTime: -1 },
        },
        {
          $limit: limit,
        },
      ])
      .toArray();

    ctx.response.status = 200;
    ctx.response.body = { models };
  } catch (error) {
    console.error("Error getting AI models for user:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};

export { getActiveAIModels, getAIModelById, getAIModelsForUser };
