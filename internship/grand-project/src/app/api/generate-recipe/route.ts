import { connectToMongoDB } from "@/app/api/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userEmail, ingredients, mealType, diet, difficulty } =
            await req.json();

        if (!userEmail) {
            return NextResponse.json(
                { error: "User email is required" },
                { status: 400 }
            );
        }

        // Call n8n webhook
        console.log(
            "➡ Sending data to n8n webhook:",
            process.env.N8N_WEBHOOK_URL
        );

        const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: `Generate a recipe in JSON format for:\n\nIngredients: ${ingredients.join(
                    ", "
                )}\n- Meal Type: ${mealType}\n- Diet: ${diet}\n- Difficulty: ${difficulty}`,
            }),
        });

        const rawText = await n8nResponse.text();

        console.log("➡ Raw n8n Response:", rawText);

        if (!n8nResponse.ok) {
            throw new Error("❌ n8n webhook failed");
        }

        // Try parsing JSON safely
        let n8nData;
        try {
            n8nData = JSON.parse(rawText);
        } catch (err) {
            console.error("❌ Could not parse JSON from n8n:", err);
            return NextResponse.json(
                { error: "Invalid JSON response from n8n", raw: rawText },
                { status: 500 }
            );
        }
        
        if (!n8nData.title || !n8nData.instructions || !n8nData.cautions) {
            return NextResponse.json(
                {
                    error: "n8n response missing required fields",
                    data: n8nData,
                },
                { status: 500 }
            );
        }

        // Save recipe to MongoDB
        const { db } = await connectToMongoDB();
        const result = await db.collection("recipes").insertOne({
            userEmail,
            ingredients,
            mealType,
            diet,
            difficulty,
            recipe: n8nData,
            createdAt: new Date(),
        });

        return NextResponse.json({ recipeId: result.insertedId });
        // return NextResponse.json({ recipe: n8nData });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("❌ Error generating recipe:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
