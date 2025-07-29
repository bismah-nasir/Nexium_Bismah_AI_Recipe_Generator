"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PreviewCard from "@/components/PreviewCard";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<any[]>([]);

    useEffect(() => {
        async function fetchAllRecipes() {
            const email = JSON.parse(localStorage.getItem("user-info")!).session
                .user.email;
            const res = await fetch(`/api/recipes?userEmail=${email}`);
            const data = await res.json();
            setRecipes(data.recipes || []);
        }
        fetchAllRecipes();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-8">
            <h2 className="text-3xl font-semibold text-orange-700 mb-6 text-center">
                All Your Recipes 🍽️
            </h2>

            {recipes.length === 0 ? (
                <p className="text-gray-600 text-center">No recipes found.</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                        // <Link
                        //     key={recipe._id}
                        //     href={`/recipes/${recipe._id}`}
                        //     className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                        //     <h4 className="text-lg font-semibold text-orange-600 mb-1">
                        //         {recipe.recipe.title}
                        //     </h4>
                        //     <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        //         {recipe.ingredients.join(", ")}
                        //     </p>
                        //     <div className="flex gap-2 flex-wrap text-xs">
                        //         <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        //             {recipe.mealType}
                        //         </span>
                        //         <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        //             {recipe.diet}
                        //         </span>
                        //         <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        //             {recipe.difficulty}
                        //         </span>
                        //     </div>
                        // </Link>
                        <PreviewCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            )}

            <div className="text-center mt-8">
                <Link
                    href="/dashboard"
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                    ⬅ Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
