import { FaissStore } from "npm:@langchain/community/vectorstores/faiss";
import { HuggingFaceInferenceEmbeddings } from "npm:@langchain/community/embeddings/hf";
import { join, dirname, fromFileUrl } from "jsr:@std/path";

const __dirname = dirname(fromFileUrl(import.meta.url));
const VECTOR_STORE_PATH = join(
  __dirname,
  "..",
  "assets",
  "vectors",
  "psychiatry_vector_store"
);
const SAMPLE_TEXT_PATH = join(
  __dirname,
  "..",
  "assets",
  "psychiatry_notes.txt"
);

/**
 * Index sample psychiatric reference materials into FAISS vector store
 */
const indexVectorStore = async () => {
  try {
    console.log("Indexing psychiatric reference data...");

    const text = await Deno.readTextFile(SAMPLE_TEXT_PATH);

    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: Deno.env.get("HUGGINGFACEHUB_API_KEY"),
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });

    const vectorStore = await FaissStore.fromTexts(
      [text], 
      [{}], 
      embeddings
    );

    await vectorStore.save(VECTOR_STORE_PATH);
    console.log(
      "Vector store indexed successfully with psychiatric materials."
    );
  } catch (error) {
    console.error("Error indexing vector store:", error);
  }
};

if (import.meta.main) {
  await indexVectorStore();
  Deno.exit(0);
}
