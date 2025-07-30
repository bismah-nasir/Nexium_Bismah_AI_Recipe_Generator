"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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

    // return (
    //     <div className="min-h-screen bg-orange-50 py-10 px-4">
    //         <div className="max-w-3xl mx-auto">
    //             <Card className="p-6 shadow-xl bg-white">
    //                 {/* Title */}
    //                 <h1 className="text-3xl font-bold text-orange-700 mb-4">
    //                     {recipe.recipe.title}
    //                 </h1>

    //                 {/* Tags */}
    //                 <div className="flex gap-2 mb-4">
    //                     {recipe.mealType && (
    //                         <Badge className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
    //                             {recipe.mealType}
    //                         </Badge>
    //                     )}
    //                     {recipe.diet && (
    //                         <Badge className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
    //                             {recipe.diet}
    //                         </Badge>
    //                     )}
    //                     {recipe.difficulty && (
    //                         <Badge className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
    //                             {recipe.difficulty}
    //                         </Badge>
    //                     )}
    //                 </div>

    //                 {/* Instructions */}
    //                 <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
    //                     Instructions:
    //                 </h2>
    //                 <ul className="list-disc pl-5 text-gray-700">
    //                     {recipe.recipe.instructions.map(
    //                         (step: string, idx: number) => (
    //                             <li key={idx} className="mb-1">
    //                                 {step}
    //                             </li>
    //                         )
    //                     )}
    //                 </ul>

    //                 {/* Cautions */}
    //                 <h2 className="text-xl font-semibold text-red-600 mt-4 mb-2">
    //                     Cautions:
    //                 </h2>
    //                 <ul className="list-disc pl-5 text-red-500">
    //                     {recipe.recipe.cautions.map(
    //                         (caution: string, idx: number) => (
    //                             <li key={idx}>{caution}</li>
    //                         )
    //                     )}
    //                 </ul>

    //                 {/* <div className="mt-6 text-center">
    //                     <Link href="/dashboard">
    //                         <Button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
    //                             ⬅ Back to Dashboard
    //                         </Button>
    //                     </Link>
    //                 </div> */}

    //                 <div className="mt-6 text-center">
    //                     <Link
    //                         href={
    //                             from === "dashboard" ? "/dashboard" : "/recipes"
    //                         }>
    //                         <Button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
    //                             ⬅{" "}
    //                             {from === "dashboard"
    //                                 ? "Back to Dashboard Hehe"
    //                                 : "Back to All Recipes"}
    //                         </Button>
    //                     </Link>
    //                 </div>
    //             </Card>
    //         </div>
    //     </div>
    // );


    return (
  <div className="min-h-screen bg-[#fff7f2] p-6 flex justify-center">
    <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
      
      {/* 🔹 Title + Tags */}
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

      {/* 🔹 Ingredients */}
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

      {/* 🔹 Instructions */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          👨‍🍳 Instructions
        </h2>
        <ol className="list-decimal list-inside text-gray-700 leading-relaxed space-y-2">
          {recipe.recipe.instructions.map((step: string, idx: number) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>

      {/* 🔹 Cautions */}
      {recipe.recipe.cautions && recipe.recipe.cautions.length > 0 && (
        <section className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            ⚠️ Cautions
          </h2>
          <ul className="list-disc list-inside text-red-700 leading-relaxed">
            {recipe.recipe.cautions.map((caution: string, idx: number) => (
              <li key={idx}>{caution}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 🔹 Back Button */}
      <div className="flex justify-center mt-6">
        <Link href={from === "dashboard" ? "/dashboard" : "/recipes"}>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md cursor-pointer flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 mt-0.5" />
            {from === "dashboard" ? "Back to Dashboard" : "Back to All Recipes"}
          </Button>
        </Link>
      </div>
    </div>
  </div>
);



}
