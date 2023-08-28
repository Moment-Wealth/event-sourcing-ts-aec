import { MongoClient, ServerApiVersion } from "mongodb";
import { Config } from "../../config";

const DB_NAME = Config.MONGO_DB_NAME;

export const getMongoDB = async () => {
  const uri = `mongodb+srv://${Config.MONGO_USER_ID}:${Config.MONGO_SECRET_KEY}@eventsourcingreaddb.fg9d5m3.mongodb.net`;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  return client.db(DB_NAME);
};
