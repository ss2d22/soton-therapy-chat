import { findActiveAIModels } from "./src/models/AIModel.ts";

const testFindAIModels = async () => {
  const models = await findActiveAIModels();
  console.log(models);
};

testFindAIModels();

