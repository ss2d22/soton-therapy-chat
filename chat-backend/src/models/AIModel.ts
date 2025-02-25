import { Collection, ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
import { db } from "../db/mongo.ts";

/**
 * Schema for AI Models
 * @author Sriram Sundar
 *
 * @interface AIModelSchema
 * @typedef {AIModelSchema}
 */
interface AIModelSchema {
  _id: ObjectId;
  name: string;
  description?: string;
<<<<<<< HEAD
  model: string;
=======
  model: string; 
>>>>>>> ae7a34f (did message related stuff)
  temperature: number;
  systemPrompt: string;
  active: boolean;
}

<<<<<<< HEAD
=======

>>>>>>> ae7a34f (did message related stuff)
const AIModel: Collection<AIModelSchema> =
  db.collection<AIModelSchema>("aimodels");

/**
 * Inserts an AI model into the database
 * @author Sriram Sundar
 *
 * @async
 * @param {Omit<AIModelSchema, "_id">} model
 * @returns {Promise<ObjectId>}
 */
const insertAIModel = async (
  model: Omit<AIModelSchema, "_id">
): Promise<ObjectId> => {
  const insertId = await AIModel.insertOne(model);
  return insertId;
};

/**
 * Finds all active AI models
 * @author Sriram Sundar
 *
 * @async
 * @returns {Promise<AIModelSchema[]>}
 */
const findActiveAIModels = async (): Promise<AIModelSchema[]> => {
  return await AIModel.find({ active: true }).toArray();
};

/**
 * Finds an AI model by ID
 * @author Sriram Sundar
 *
 * @async
 * @param {string} id
 * @returns {Promise<AIModelSchema | undefined>}
 */
const findAIModelById = async (
  id: string
): Promise<AIModelSchema | undefined> => {
  console.log(id);

  return await AIModel.findOne({ _id: new ObjectId(id) });
};

export { AIModel, insertAIModel, findActiveAIModels, findAIModelById };
export type { AIModelSchema };
