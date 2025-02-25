import { HfInference } from "npm:@huggingface/inference";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "npm:@langchain/core/prompts";
import { Document } from "npm:langchain/document";
import { BaseMessage } from "npm:@langchain/core/messages";
import { loadVectorStore } from "./vectorStoreService.ts";

// Initialize HuggingFace Inference with your API key.
const hf = new HfInference(Deno.env.get("HUGGINGFACEHUB_API_KEY") || "");

/**
 * This interface defines a vector store that exposes a similaritySearch method.
 */
interface ExtendedFaissStore {
  similaritySearch(query: string, k: number): Promise<Document[]>;
}

/**
 * Creates a history-aware retriever that reformulates the user's question
 * and retrieves relevant documents.
 *
 * @param input - The user's input.
 * @param chatHistory - Chat history messages.
 * @param model - The chosen model (swappable).
 * @param temperature - The temperature for generation.
 * @returns An object containing the reformulated query and retrieved documents.
 */
const createHistoryRetriever = async (
  input: string,
  chatHistory: BaseMessage[],
  model: string,
  temperature: number
): Promise<{ query: string; documents: Document[] }> => {
  try {
    // Load the vector store.
    const vectorStore = await loadVectorStore();

    const contextualizeQSystemPrompt = `
Given the chat history and the user's latest question (which may reference content from the chat history),
please reformulate a standalone question that can be understood without the chat history.
Don't answer the question, just reformulate it if needed, otherwise return it as is.`;

    const contextualizePrompt = ChatPromptTemplate.fromMessages([
      { role: "system", content: contextualizeQSystemPrompt },
      new MessagesPlaceholder("chat_history"),
      { role: "user", content: "{input}" },
    ]);

    // Map the chat history to objects with role and string content.
    const historyMessages: { role: string; content: string }[] =
      chatHistory.map((msg: BaseMessage) => {
        let role = "system";
        // Safely check for _getType using a cast to any.
        const maybeGetType = (msg as any)._getType as
          | (() => string)
          | undefined;
        if (maybeGetType !== undefined) {
          const msgType = maybeGetType();
          if (msgType === "human") {
            role = "user";
          } else if (msgType === "ai") {
            role = "assistant";
          }
        }
        const content =
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content);
        return { role, content };
      });

    // Format the prompt with the chat history and the user's input.
    const promptFormatted = await contextualizePrompt.formatMessages({
      chat_history: historyMessages,
      input,
    });

    // The returned prompt is an array of messages. We cast it to our expected shape.
    const formattedMessages = promptFormatted as unknown as Array<{
      role: string;
      content: string;
    }>;
    const promptText = formattedMessages
      .map((m) => {
        return `${
          m.role === "system"
            ? "System: "
            : m.role === "user"
            ? "Human: "
            : "Assistant: "
        }${m.content}`;
      })
      .join("\n");

    // Use the selected model and temperature to generate a reformulated query.
    // this is just here for me messing around now @shayna003 remove this part
    const response = await hf.textGeneration({
      model: model,
      inputs: promptText,
      parameters: {
        max_new_tokens: 100,
        temperature: temperature,
        return_full_text: false,
      },
    });

    const query = response.generated_text || input;

    // Retrieve similar documents from the vector store.
    const documents = await (
      vectorStore as unknown as ExtendedFaissStore
    ).similaritySearch(query, 3);
    console.log("Retrieved documents:", documents);
    console.log("query:", query);

    return { query, documents };
  } catch (error) {
    console.error("Error in history retriever:", error);
    return { query: input, documents: [] };
  }
};

/**
 * Creates the QA chain that uses the system prompt (augmented with context),
 * chat history, and the (possibly reformulated) query to generate an answer.
 *
 * @param model - The chosen model.
 * @param temperature - The temperature for generation.
 * @param systemPrompt - The system prompt from the selected model.
 * @param input - The (possibly reformulated) query.
 * @param chatHistory - Chat history messages.
 * @param documents - The documents retrieved from the vector store.
 * @returns The AI answer along with the context documents.
 */
const createQAChain = async (
  model: string,
  temperature: number,
  systemPrompt: string,
  input: string,
  chatHistory: BaseMessage[],
  documents: Document[]
): Promise<{ answer: string; context: Document[] }> => {
  try {
    // Build a context string from the retrieved documents.
    const context = documents.map((doc) => doc.pageContent).join("\n\n");

    // Create a full system prompt by appending the context.
    const fullSystemPrompt = `${systemPrompt}\n\nContext information:\n${context}`;

    const qaPrompt = ChatPromptTemplate.fromMessages([
      { role: "system", content: fullSystemPrompt },
      new MessagesPlaceholder("chat_history"),
      { role: "user", content: "{input}" },
    ]);

    // Map the chat history to objects with role and string content.
    const historyMessages: { role: string; content: string }[] =
      chatHistory.map((msg: BaseMessage) => {
        let role = "system";
        const maybeGetType = (msg as any)._getType as
          | (() => string)
          | undefined;
        if (maybeGetType !== undefined) {
          const msgType = maybeGetType();
          if (msgType === "human") {
            role = "user";
          } else if (msgType === "ai") {
            role = "assistant";
          }
        }
        const content =
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content);
        return { role, content };
      });

    // Format the QA prompt with the chat history and input.
    const promptFormatted = await qaPrompt.formatMessages({
      chat_history: historyMessages,
      input,
    });

    // Cast the formatted messages to our expected type.
    const formattedMessages = promptFormatted as unknown as Array<{
      role: string;
      content: string;
    }>;
    const promptText = formattedMessages
      .map((m) => {
        return `${
          m.role === "system"
            ? "System: "
            : m.role === "user"
            ? "Human: "
            : "Assistant: "
        }${m.content}`;
      })
      .join("\n");

    // Generate the answer using the chosen model.
    const response = await hf.textGeneration({
      model: model,
      inputs: promptText,
      parameters: {
        max_new_tokens: 500,
        temperature: temperature,
        return_full_text: false,
      },
    });

    return {
      answer: response.generated_text || "Sorry, I can't answer that question.",
      context: documents,
    };
  } catch (error) {
    console.error("Error in QA chain:", error);
    return {
      answer: "Sorry, there was an error processing your request.",
      context: [],
    };
  }
};

export { createHistoryRetriever, createQAChain };
