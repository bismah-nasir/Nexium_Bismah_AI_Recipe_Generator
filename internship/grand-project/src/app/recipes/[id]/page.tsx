"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Beef, Droplet, Flame, Wheat } from "lucide-react";
import { toSentenceCase } from "@/lib/format";

export default function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const params = useSearchParams();
    const from = params.get("from");

    useEffect(() => {
        const fetchRecipe = async () => {
            const res = await fetch(`/api/recipes/${id}`);
            const data = await res.json();
            setRecipe(data);
            setLoading(false);
        };
        fetchRecipe();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Loading recipe...</p>;
    if (!recipe) return <p className="text-center mt-10">Recipe not found.</p>;

    return (
        <div className="min-h-screen bg-[#fff7f2] p-6 flex justify-center">
            {/* Grid: TWO separate cards side by side */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Recipe Details Card */}
                <div className="lg:col-span-2 bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                    {/* Title + Tags */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h1 className="text-3xl font-bold text-orange-700">
                            {recipe.recipe.title}
                        </h1>
                        <div className="flex gap-2 mt-3 sm:mt-0">
                            {recipe.mealType && (
                                <Badge className="bg-orange-100 text-orange-700 border border-orange-300 px-3">
                                    {toSentenceCase(recipe.mealType)}
                                </Badge>
                            )}
                            {recipe.diet && (
                                <Badge className="bg-green-100 text-green-700 border border-green-300 px-3">
                                    {toSentenceCase(recipe.diet)}
                                </Badge>
                            )}
                            {recipe.difficulty && (
                                <Badge className="bg-blue-100 text-blue-700 border border-blue-300 px-3">
                                    {toSentenceCase(recipe.difficulty)}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Cook Time + Servings */}
                    <div className="flex gap-3 mb-6">
                        {recipe.recipe.cook_time && (
                            <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3">
                                🕒 {recipe.recipe.cook_time}
                            </Badge>
                        )}
                        {recipe.recipe.servings && (
                            <Badge className="bg-purple-100 text-purple-700 border border-purple-300 px-3">
                                🍽 {recipe.recipe.servings} servings
                            </Badge>
                        )}
                    </div>

                    {/* Ingredients */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            🥗 Ingredients
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                            {recipe.ingredients.map(
                                (item: string, idx: number) => (
                                    <li key={idx}>{toSentenceCase(item)}</li>
                                )
                            )}
                        </ul>
                    </section>

                    {/* Instructions */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            👨‍🍳 Instructions
                        </h2>
                        <ol className="list-decimal list-inside text-gray-700 leading-relaxed space-y-2">
                            {recipe.recipe.instructions.map(
                                (step: string, idx: number) => (
                                    <li key={idx}>{step}</li>
                                )
                            )}
                        </ol>
                    </section>

                    {/* Cautions */}
                    {recipe.recipe.cautions?.length > 0 && (
                        <section className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <h2 className="text-lg font-semibold text-red-700 mb-2">
                                ⚠️ Cautions
                            </h2>
                            <ul className="list-disc list-inside text-red-700 leading-relaxed">
                                {recipe.recipe.cautions.map(
                                    (caution: string, idx: number) => (
                                        <li key={idx}>{caution}</li>
                                    )
                                )}
                            </ul>
                        </section>
                    )}

                    {/* Chef’s Tips */}
                    {recipe.recipe.chef_tips?.length > 0 && (
                        <section className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                            <h2 className="text-lg font-semibold text-green-700 mb-2">
                                👨‍🍳 Chef’s Tips
                            </h2>
                            <ul className="list-disc list-inside text-green-700 leading-relaxed">
                                {recipe.recipe.chef_tips.map(
                                    (tip: string, idx: number) => (
                                        <li key={idx}>{tip}</li>
                                    )
                                )}
                            </ul>
                        </section>
                    )}

                    {/* Back Button */}
                    <div className="flex justify-center mt-6">
                        <Link
                            href={
                                from === "dashboard" ? "/dashboard" : "/recipes"
                            }>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md cursor-pointer flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4 mt-0.5" />
                                {from === "dashboard"
                                    ? "Back to Dashboard"
                                    : "Back to All Recipes"}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* RIGHT COLUMN: Nutrition Breakdown Card */}
                <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 h-fit">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        📊 Nutrition
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-orange-100 p-3 rounded-lg text-center">
                            <Flame className="h-5 w-5 text-orange-700 mx-auto mb-1" />
                            <p className="text-orange-700 font-bold">
                                {recipe.recipe.nutrition?.calories || 0} kcal
                            </p>
                            <p className="text-xs text-gray-600">Calories</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg text-center">
                            <Beef className="h-5 w-5 text-green-700 mx-auto mb-1" />
                            <p className="text-green-700 font-bold">
                                {recipe.recipe.nutrition?.protein || 0}g
                            </p>
                            <p className="text-xs text-gray-600">Protein</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg text-center">
                            <Wheat className="h-5 w-5 text-blue-700 mx-auto mb-1" />
                            <p className="text-blue-700 font-bold">
                                {recipe.recipe.nutrition?.carbs || 0}g
                            </p>
                            <p className="text-xs text-gray-600">Carbs</p>
                        </div>
                        <div className="bg-pink-100 p-3 rounded-lg text-center">
                            <Droplet className="h-5 w-5 text-pink-700 mx-auto mb-1" />
                            <p className="text-pink-700 font-bold">
                                {recipe.recipe.nutrition?.fat || 0}g
                            </p>
                            <p className="text-xs text-gray-600">Fat</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* end grid */}
        </div>
    );
}
