"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen bg-orange-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <Card className="p-6 shadow-xl bg-white">
                    <h1 className="text-3xl font-bold text-orange-700 mb-4">
                        {recipe.recipe.title}
                    </h1>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                        <Badge className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">{recipe.mealType}</Badge>
                        <Badge>{recipe.diet}</Badge>
                        <Badge>{recipe.difficulty}</Badge>
                    </div>

                    {/* Instructions */}
                    <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                        Instructions:
                    </h2>
                    <ul className="list-disc pl-5 text-gray-700">
                        {recipe.recipe.instructions.map(
                            (step: string, idx: number) => (
                                <li key={idx} className="mb-1">
                                    {step}
                                </li>
                            )
                        )}
                    </ul>

                    {/* Cautions */}
                    <h2 className="text-xl font-semibold text-red-600 mt-4 mb-2">
                        Cautions:
                    </h2>
                    <ul className="list-disc pl-5 text-red-500">
                        {recipe.recipe.cautions.map(
                            (caution: string, idx: number) => (
                                <li key={idx}>{caution}</li>
                            )
                        )}
                    </ul>

                    <div className="mt-6 text-center">
                        <Link href="/dashboard">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
                                ⬅ Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
