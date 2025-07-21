import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;

if (!uri) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToMongoDB() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    try {
        await client.connect();
        // Assuming your database name is part of the URI, or you can specify it here
        const dbName = new URL(uri).pathname.substring(1); // Extracts db name from URI like /mydb
        const db = client.db(dbName || "ai_recipe_generator"); // Use default if no db name in URI

        cachedClient = client;
        cachedDb = db;

        console.log("Successfully connected to MongoDB!");
        return { client, db };
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}
