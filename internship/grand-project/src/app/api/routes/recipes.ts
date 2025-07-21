import type { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB } from "../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

    const userEmail = req.query.email as string;
    if (!userEmail) {
        return res.status(400).json({ error: "Missing email in query" });
    }

    try {
        const { db } = await connectToMongoDB();
        const recipes = await db
            .collection("recipes")
            .find({ userEmail })
            .toArray();
        return res.status(200).json({ recipes });
    } catch (err) {
        console.error("MongoDB Error:", err);
        return res.status(500).json({ error: "Failed to fetch recipes" });
    }
}
