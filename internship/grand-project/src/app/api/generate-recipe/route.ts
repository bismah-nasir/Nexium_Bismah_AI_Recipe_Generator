import { connectToMongoDB } from "@/app/api/lib/mongodb";
import { NextResponse } from "next/server";
import { getRequestUserEmail } from "@/app/api/lib/auth";
import { generateRecipe, RecipeRequestSchema } from "@/app/api/lib/gemini";

// Give Vercel enough time to wait for the model's response.
export const maxDuration = 60;

const UNUSABLE_INGREDIENTS_MESSAGE =
    "We couldn't find any real food in that list. Try ingredients like chicken, rice, or tomato.";

export async function POST(req: Request) {
    try {
        const userEmail = await getRequestUserEmail(req);
        if (!userEmail) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const input = RecipeRequestSchema.safeParse(await req.json());
        if (!input.success) {
            return NextResponse.json(
                {
                    error: "Please use 1 to 20 ingredients, each under 50 characters.",
                },
                { status: 400 }
            );
        }

        const generated = await generateRecipe(input.data);

        if (!generated) {
            return NextResponse.json(
                { error: UNUSABLE_INGREDIENTS_MESSAGE },
                { status: 422 }
            );
        }

        if (!generated.can_make_recipe || !generated.recipe) {
            return NextResponse.json(
                {
                    error:
                        generated.rejection_reason ||
                        UNUSABLE_INGREDIENTS_MESSAGE,
                },
                { status: 422 }
            );
        }

        const { mealType, diet, difficulty } = input.data;

        // Save recipe to MongoDB
        const { db } = await connectToMongoDB();
        const result = await db.collection("recipes").insertOne({
            userEmail,
            ingredients: generated.ingredients_used,
            mealType,
            diet,
            difficulty,
            recipe: generated.recipe,
            createdAt: new Date(),
        });

        return NextResponse.json({ recipeId: result.insertedId });
    } catch (err) {
        console.error("❌ Error generating recipe:", err);
        return NextResponse.json(
            { error: "Failed to generate recipe" },
            { status: 500 }
        );
    }
}
