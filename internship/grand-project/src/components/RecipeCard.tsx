"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toSentenceCase } from "@/lib/format";

export default function RecipeCard({ recipe }: { recipe: any }) {
    const router = useRouter();

    return (
        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
            {/* Title + Tags */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-orange-700">
                    {recipe.recipe.title}
                </h1>
                <div className="flex gap-2 mt-3 sm:mt-0">
                    {recipe.mealType && (
                        <Badge className="bg-orange-100 text-orange-700 border border-orange-300 px-3">
                            {recipe.mealType}
                        </Badge>
                    )}
                    {recipe.diet && (
                        <Badge className="bg-green-100 text-green-700 border border-green-300 px-3">
                            {recipe.diet}
                        </Badge>
                    )}
                    {recipe.difficulty && (
                        <Badge className="bg-blue-100 text-blue-700 border border-blue-300 px-3">
                            {recipe.difficulty}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Ingredients */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    🥗 Ingredients
                </h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                    {recipe.ingredients.map((item: string, idx: number) => (
                        <li key={idx}>{toSentenceCase(item)}</li>
                    ))}
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
            {recipe.recipe.cautions && recipe.recipe.cautions.length > 0 && (
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

            {/* Back to Dashboard Button */}
            <div className="flex justify-center mt-6">
                <Button
                    onClick={() => router.push("/dashboard")}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md cursor-pointer flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4 mt-0.5" />
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
}
