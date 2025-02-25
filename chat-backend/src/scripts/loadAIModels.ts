import { db } from "../db/mongo.ts";
import { insertAIModel } from "../models/AIModel.ts";

/**
 * Loads AI models into the database for psychiatric tasks.
 * @author Sriram Sundar
 *
 * @async
 * @returns {Promise<void>}
 */
const loadAIModels = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB...");

    const aiModelsData = [
      {
        name: "Trauma-Informed AI Counselor",
        description: "Specialist in trauma counseling and PTSD support",
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        temperature: 0.1,
        systemPrompt: `You are a trauma-informed AI counselor, trained to support individuals dealing with PTSD and related issues.
Provide trauma-sensitive responses and recommend grounding techniques where appropriate.`,
        active: true,
      },
      {
        name: "Anxiety Management AI",
        description: "Helps users manage anxiety with therapeutic techniques",
        model: "HuggingFaceH4/zephyr-7b-beta",
        temperature: 0.15,
        systemPrompt: `You are an AI therapist specializing in anxiety management. 
Your responses should be calming, practical, and in line with Cognitive Behavioral Therapy (CBT) and mindfulness techniques.`,
        active: true,
      },
      {
        name: "Depression Support AI",
        description: "Provides support and coping strategies for depression",
        model: "meta-llama/Llama-3-8B",
        temperature: 0.25,
        systemPrompt: `You are an AI assistant designed to provide support for individuals experiencing depression.
Offer empathetic, evidence-based coping mechanisms and encourage professional consultation when necessary.`,
        active: true,
      },
    ];

    for (const model of aiModelsData) {
      const existingModel = await db
        .collection("aimodels")
        .findOne({ name: model.name });

      if (!existingModel) {
        await insertAIModel(model);
        console.log(`Added AI model: ${model.name}`);
      } else {
        console.log(`AI model already exists: ${model.name}`);
      }
    }

    console.log("All AI models loaded.");
  } catch (error) {
    console.error("Error loading AI models:", error);
  }
};

if (import.meta.main) {
  await loadAIModels();
  Deno.exit(0);
}

export { loadAIModels };
