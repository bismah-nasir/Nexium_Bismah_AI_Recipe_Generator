import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToMongoDB } from "@/app/api/lib/mongodb";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { db } = await connectToMongoDB();
        const recipe = await db
            .collection("recipes")
            .findOne({ _id: new ObjectId(params.id) });

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
