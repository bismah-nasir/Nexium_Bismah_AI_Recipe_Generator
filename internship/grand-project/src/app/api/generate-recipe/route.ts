// import type { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "../lib/supabase";
// import { connectToMongoDB } from "../lib/mongodb";

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

//     const token = req.headers.authorization?.replace("Bearer ", "");
//     if (!token) {
//         return res.status(401).json({ error: "Missing authorization token" });
//     }

//     const {
//         data: { user },
//         error,
//     } = await supabase.auth.getUser(token);
//     if (error || !user) {
//         return res.status(401).json({ error: "Invalid or expired token" });
//     }

//     const { recipeName, ingredients, instructions } = req.body;
//     if (!recipeName || !ingredients || !instructions) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     try {
//         const { db } = await connectToMongoDB();
//         const result = await db.collection("recipes").insertOne({
//             userEmail: user.email,
//             recipeName,
//             ingredients,
//             instructions,
//             createdAt: new Date(),
//         });

//         return res
//             .status(201)
//             .json({ message: "Recipe saved", id: result.insertedId });
//     } catch (err) {
//         console.error("MongoDB Error:", err);
//         return res.status(500).json({ error: "Failed to save recipe" });
//     }
// }

// import { NextResponse } from "next/server";
// import { connectToMongoDB } from "../lib/mongodb";

// export async function POST(req: Request) {
//   try {
//     const { userEmail, ingredients, mealType, diet, difficulty } = await req.json();

//     // 1) Validate userEmail exists (basic security check)
//     if (!userEmail) {
//       return NextResponse.json({ error: "User email is required" }, { status: 400 });
//     }

//     // 2) Call n8n webhook
//     const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ingredients, mealType, diet, difficulty }),
//     });

//     const n8nData = await n8nResponse.json();

//     if (!n8nResponse.ok) {
//       throw new Error(n8nData.error || "n8n failed to generate recipe");
//     }

//     // 3) Save recipe to MongoDB
//     const { db } = await connectToMongoDB();
//     await db.collection("recipes").insertOne({
//       userEmail,
//       ingredients,
//       mealType,
//       diet,
//       difficulty,
//       recipe: n8nData.recipe,
//       createdAt: new Date(),
//     });

//     // 4) Return recipe to frontend
//     return NextResponse.json({ recipe: n8nData.recipe });
//   } catch (err: any) {
//     console.error("❌ Error generating recipe:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import { connectToMongoDB } from "../lib/mongodb";

// export async function POST(req: Request) {
//     try {
//         const { userEmail, ingredients, mealType, diet, difficulty } =
//             await req.json();

//         // 1️⃣ Validate input
//         if (!userEmail) {
//             return NextResponse.json(
//                 { error: "User email is required" },
//                 { status: 400 }
//             );
//         }

//         // 2️⃣ Call n8n webhook
//         const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ ingredients, mealType, diet, difficulty }),
//         });

//         if (!n8nResponse.ok) {
//             throw new Error(`n8n error: ${n8nResponse.statusText}`);
//         }

//         const n8nData = await n8nResponse.json();
//         console.log("n8n raw data:", n8nData);

//         // 3️⃣ Extract & parse AI JSON safely
//         // eslint-disable-next-line prefer-const
//         let aiText = n8nData[0]?.text || "";
//         let parsedRecipe;

//         try {
//             parsedRecipe = JSON.parse(aiText);
//         } catch (parseErr) {
//             console.error("❌ JSON Parse Error:", parseErr);
//             throw new Error("AI returned invalid JSON format");
//         }

//         // ✅ Validate parsed recipe keys
//         if (
//             !parsedRecipe.title ||
//             !parsedRecipe.instructions ||
//             !parsedRecipe.cautions
//         ) {
//             throw new Error("Recipe JSON missing required fields");
//         }

//         // 4️⃣ Save to MongoDB
//         const { db } = await connectToMongoDB();
//         const result = await db.collection("recipes").insertOne({
//             userEmail,
//             ingredients,
//             mealType,
//             diet,
//             difficulty,
//             recipe: parsedRecipe,
//             createdAt: new Date(),
//         });

//         console.log("✅ Recipe saved to MongoDB:", result.insertedId);

//         // 5️⃣ Send back parsed recipe
//         return NextResponse.json({ recipe: parsedRecipe });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//         console.error("❌ generate-recipe.ts error:", err);
//         return NextResponse.json(
//             { error: err.message || "Recipe generation failed" },
//             { status: 500 }
//         );
//     }
// }

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

        // ✅ 1) Call n8n webhook
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

        const rawText = await n8nResponse.text(); // ✅ READ AS TEXT FIRST
        console.log("➡ Raw n8n Response:", rawText);

        if (!n8nResponse.ok) {
            throw new Error("❌ n8n webhook failed");
        }

        // ✅ Try parsing JSON safely
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

        // // ✅ 2) Validate parsed JSON
        // if (!n8nData || !n8nData.text) {
        //     return NextResponse.json(
        //         {
        //             error: "n8n response missing expected fields",
        //             data: n8nData,
        //         },
        //         { status: 500 }
        //     );
        // }

        // ✅ FIX: We don’t look for `n8nData.text` anymore
        if (!n8nData.title || !n8nData.instructions || !n8nData.cautions) {
            return NextResponse.json(
                {
                    error: "n8n response missing required fields",
                    data: n8nData,
                },
                { status: 500 }
            );
        }

        // // ✅ 3) Try parsing AI JSON from n8n.text

        // const cleanText = rawText
        //     .trim()
        //     .replace(/```json/gi, "")
        //     .replace(/```/g, "");

        // let parsedRecipe;
        // try {
        //     parsedRecipe = JSON.parse(cleanText);
        // } catch (err) {
        //     console.error("❌ Could not parse AI JSON output:", err);
        //     return NextResponse.json(
        //         { error: "AI output was not valid JSON", raw: n8nData.text },
        //         { status: 500 }
        //     );
        // }

        // ✅ 4) Save recipe to MongoDB
        const { db } = await connectToMongoDB();
        await db.collection("recipes").insertOne({
            userEmail,
            ingredients,
            mealType,
            diet,
            difficulty,
            recipe: n8nData,
            createdAt: new Date(),
        });

        return NextResponse.json({ recipe: n8nData });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("❌ Error generating recipe:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
