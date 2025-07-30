import { connectToMongoDB } from "@/app/api/lib/mongodb";
import { ObjectId } from "mongodb";
import RecipeCard from "@/components/RecipeCard";

export default async function RecipePage({
    params,
}: {
    params: { id: string };
}) {
    const { db } = await connectToMongoDB();

    // Fetch recipe by MongoDB ID
    const recipe = await db
        .collection("recipes")
        .findOne({ _id: new ObjectId(params.id) });

    if (!recipe) {
        return (
            <div className="text-center text-red-500 mt-10">
                ❌ Recipe not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fff7f2] p-6 flex justify-center">
            <RecipeCard recipe={recipe} />
        </div>
    );
}
