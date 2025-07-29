// import { connectToMongoDB } from "@/app/api/lib/mongodb";
// import { ObjectId } from "mongodb";
// import RecipeCard from "@/components/RecipeCard";

// export default async function RecipePage({
//     params,
// }: {
//     params: { id: string };
// }) {
//     const { db } = await connectToMongoDB();
//     const recipe = await db
//         .collection("recipes")
//         .findOne({ _id: new ObjectId(params.id) });

//     if (!recipe) {
//         return (
//             <div className="text-center text-red-500 mt-10">
//                 Recipe not found
//             </div>
//         );
//     }

//     // ✅ Fetch last 3 recipes for this user
//     const previousRecipes = await db
//         .collection("recipes")
//         .find({ userEmail: recipe.userEmail, _id: { $ne: recipe._id } })
//         .sort({ createdAt: -1 })
//         .limit(3)
//         .toArray();

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             <RecipeCard
//                 title={recipe.recipe.title}
//                 instructions={recipe.recipe.instructions}
//                 cautions={recipe.recipe.cautions}
//                 ingredients={recipe.ingredients}
//                 tags={{
//                     mealType: recipe.mealType,
//                     diet: recipe.diet,
//                     difficulty: recipe.difficulty,
//                 }}
//             />

//             {/* ✅ Show last 3 recipes */}
//             <h2 className="text-xl font-semibold mt-8 mb-4">
//                 Your Previous Recipes
//             </h2>
//             <div className="grid gap-4">
//                 {previousRecipes.map((r) => (
//                     <RecipeCard
//                         key={r._id.toString()}
//                         title={r.recipe.title}
//                         instructions={r.recipe.instructions}
//                         cautions={r.recipe.cautions}
//                         ingredients={r.ingredients}
//                         tags={{
//                             mealType: r.mealType,
//                             diet: r.diet,
//                             difficulty: r.difficulty,
//                         }}
//                     />
//                 ))}
//             </div>

//             {/* ✅ See More Button */}
//             <div className="text-center mt-6">
//                 <a
//                     href="/recipes"
//                     className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
//                     See All Recipes →
//                 </a>
//             </div>
//         </div>
//     );
// }

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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-6 flex justify-center">
            <RecipeCard recipe={recipe} />
        </div>
    );
}
