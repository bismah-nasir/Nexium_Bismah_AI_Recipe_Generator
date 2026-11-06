import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/app/api/lib/mongodb";
import { getRequestUserEmail } from "@/app/api/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "0", 10);

        const userEmail = await getRequestUserEmail(req);
        if (!userEmail) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { db } = await connectToMongoDB();

        let query = db
            .collection("recipes")
            .find({ userEmail })
            .sort({ createdAt: -1 });

        if (limit > 0) {
            query = query.limit(limit);
        }

        const recipes = await query.toArray();

        return NextResponse.json({ recipes });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("❌ Error fetching recipes:", err);
        return NextResponse.json(
            { error: "Failed to fetch recipes" },
            { status: 500 }
        );
    }
}
