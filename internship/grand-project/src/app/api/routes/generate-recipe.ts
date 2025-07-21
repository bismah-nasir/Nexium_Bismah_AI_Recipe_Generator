import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../lib/supabase";
import { connectToMongoDB } from "../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "Missing authorization token" });
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { recipeName, ingredients, instructions } = req.body;
    if (!recipeName || !ingredients || !instructions) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const { db } = await connectToMongoDB();
        const result = await db.collection("recipes").insertOne({
            userEmail: user.email,
            recipeName,
            ingredients,
            instructions,
            createdAt: new Date(),
        });

        return res
            .status(201)
            .json({ message: "Recipe saved", id: result.insertedId });
    } catch (err) {
        console.error("MongoDB Error:", err);
        return res.status(500).json({ error: "Failed to save recipe" });
    }
}
