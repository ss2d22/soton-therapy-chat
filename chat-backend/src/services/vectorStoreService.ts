import { dirname, fromFileUrl, join } from "jsr:@std/path";
import { HuggingFaceInferenceEmbeddings } from "npm:@langchain/community/embeddings/hf";
import { FaissStore } from "npm:@langchain/community/vectorstores/faiss";

// Get the directory of the current file
const __dirname = dirname(fromFileUrl(import.meta.url));

// Path to the vector store - We're using a single textbook for all chats
const VECTOR_STORE_PATH = join(
  __dirname,
  "..",
  "assets",
  "vectors",
  "main_textbook_vector_store"
);

// Cache the loaded vector store
let vectorStoreCache: FaissStore | null = null;

/**
 * Loads the vector store for RAG
 * @author Sriram Sundar
 *
 * @async
 * @returns {Promise<FaissStore>} The loaded vector store
 */
const loadVectorStore = async (): Promise<FaissStore> => {
  if (vectorStoreCache) {
    return vectorStoreCache;
  }

  try {
    console.log(`Loading vector store from: ${VECTOR_STORE_PATH}`);

    // Create embeddings with HuggingFace
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: Deno.env.get("HUGGINGFACEHUB_API_KEY"),
      model: "sentence-transformers/all-MiniLM-L6-v2", 
    });

    // Load the vector store
    const vectorStore = await FaissStore.load(VECTOR_STORE_PATH, embeddings);

    vectorStoreCache = vectorStore;
    console.log("Vector store loaded successfully");
    return vectorStore;
  } catch (error) {
    console.error("Error loading vector store:", error);
    throw error;
  }
};

export { loadVectorStore };
