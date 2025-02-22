import { MongoClient } from "https://deno.land/x/mongo@v0.34.0/mod.ts";

const client = new MongoClient();
const env = Deno.env.toObject();
console.log("env:", env["MONGODB_URI"]);

const MONGO_URI = Deno.env.get("MONGODB_URI") || "";
if (MONGO_URI === "") {
  throw new Error("MONGODB_URI is required");
}
console.log(MONGO_URI, "MONGO_URI for testing ");
await client
  .connect(MONGO_URI)
  .then(() => {
    console.log("connected to mongo db");
  })
  .catch((err) => {
    console.error(err);
  });

export const db = client.database("soton_therapy");
