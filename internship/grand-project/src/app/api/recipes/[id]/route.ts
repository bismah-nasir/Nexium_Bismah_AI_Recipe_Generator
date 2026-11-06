import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToMongoDB } from "@/app/api/lib/mongodb";
import { getRequestUserEmail } from "@/app/api/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userEmail = await getRequestUserEmail(req);
        if (!userEmail) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Recipe not found" },
                { status: 404 }
            );
        }

        const { db } = await connectToMongoDB();
        // Only return the recipe if it belongs to the logged-in user
        const recipe = await db
            .collection("recipes")
            .findOne({ _id: new ObjectId(id), userEmail });

        if (!recipe) {
            return NextResponse.json(
                { error: "Recipe not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(recipe);
    } catch (err: any) {
        console.error("❌ Error fetching recipe:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
