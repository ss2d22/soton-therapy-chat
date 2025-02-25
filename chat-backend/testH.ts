import { HfInference } from "npm:@huggingface/inference";

const hf = new HfInference(Deno.env.get("HUGGINGFACEHUB_API_KEY"));

const testHuggingFace = async () => {
  try {
    const response = await hf.textGeneration({
      model: "tiiuae/falcon-7b-instruct",
      inputs: "What is Cognitive Behavioral Therapy (CBT)?",
      parameters: { max_new_tokens: 50 },
    });

    console.log("Hugging Face API Response:", response.generated_text);
  } catch (error) {
    console.error("Error testing Hugging Face API:", error);
  }
};

testHuggingFace();
