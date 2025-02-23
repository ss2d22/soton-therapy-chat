import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.34.0/mod.ts";

/**
 * client that connects to the mongo db instance
 * @author Sriram Sundar
 *
 * @type {MongoClient}
 */
const client: MongoClient = new MongoClient();

/**
 * url to connect to the mongo db instance
 * @author Sriram Sundar
 *
 * @type {string}
 */
const MONGO_URI: string = Deno.env.get("MONGODB_URI") || "";

if (MONGO_URI === "") {
  throw new Error("MONGODB_URI is required");
}

await client
  .connect(MONGO_URI)
  .then(() => {
    console.log("connected to mongo db");
  })
  .catch((err) => {
    console.error(err);
  });

/**
 * database instance that connects to the soton_therapy database in the mongo db instance
 * @author Sriram Sundar
 *
 * @type {Database}
 */
const db: Database = client.database("soton_therapy");

export { db };
