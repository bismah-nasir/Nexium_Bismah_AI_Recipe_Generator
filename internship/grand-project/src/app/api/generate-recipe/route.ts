import { GoogleGenAI } from "@google/genai";
import { connectToMongoDB } from "@/app/api/lib/mongodb";
import { NextResponse } from "next/server";
import { getRequestUserEmail } from "@/app/api/lib/auth";
import { z } from "zod";

// Give Vercel enough time to wait for the model's response.
export const maxDuration = 60;

// The shape the recipe page reads from recipe.recipe.
const RecipeSchema = z.object({
    title: z.string(),
    cook_time: z.string().describe('Total time, e.g. "30 minutes"'),
    servings: z.number().describe("Number of servings, as a whole number"),
    instructions: z.array(z.string()),
    cautions: z.array(z.string()),
    chef_tips: z.array(z.string()),
    nutrition: z
        .object({
            calories: z.number().describe("kcal per serving"),
            protein: z.number().describe("grams per serving"),
            carbs: z.number().describe("grams per serving"),
            fat: z.number().describe("grams per serving"),
        })
        .describe("Estimated values per serving"),
});

const SYSTEM_PROMPT = `You are a chef who writes clear, reliable recipes for home cooks.

Build the recipe around the ingredients the user lists. You may add common pantry staples such as salt, oil, and spices. Respect the requested meal type, diet, and difficulty.

The recipe page only shows the user's ingredient names, so state the quantity of each ingredient in the instruction step that uses it.

Use cautions for allergens in the recipe and food safety points such as safe cooking temperatures.`;

export async function POST(req: Request) {
    try {
        const userEmail = await getRequestUserEmail(req);
        if (!userEmail) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { ingredients, mealType, diet, difficulty } = await req.json();

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json(
                { error: "At least one ingredient is required" },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
            contents: `Ingredients: ${ingredients.join(
                ", "
            )}\nMeal Type: ${mealType}\nDiet: ${diet}\nDifficulty: ${difficulty}`,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseJsonSchema: z.toJSONSchema(RecipeSchema),
            },
        });

        // text is empty when Gemini blocks the request or returns no candidate.
        if (!response.text) {
            console.error(
                "❌ No recipe returned:",
                response.promptFeedback?.blockReason ??
                    response.candidates?.[0]?.finishReason
            );
            return NextResponse.json(
                { error: "Could not generate a recipe for these ingredients" },
                { status: 502 }
            );
        }

        const recipe = RecipeSchema.parse(JSON.parse(response.text));

        // Save recipe to MongoDB
        const { db } = await connectToMongoDB();
        const result = await db.collection("recipes").insertOne({
            userEmail,
            ingredients,
            mealType,
            diet,
            difficulty,
            recipe,
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
