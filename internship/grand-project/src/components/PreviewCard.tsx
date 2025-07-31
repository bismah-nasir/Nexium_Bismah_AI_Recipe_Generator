"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toSentenceCase } from "@/lib/format";

export default function PreviewCard({
    recipe,
    from,
    variant = "white",
}: {
    recipe: any;
    from: "dashboard" | "recipes";
    variant?: "white" | "peach";
}) {
    // Decide background color based on variant
    const cardBg = variant === "white" ? "bg-white" : "bg-[#fff1e6]";

    return (
        <Link
            href={`/recipes/${recipe._id}?from=${from}`}
            className={`block ${cardBg} p-4 rounded-lg border border-orange-300 shadow hover:shadow-lg transition max-w-sm`}>
            {/* Recipe Title */}
            <h4 className="text-lg font-semibold text-orange-600 mb-1">
                {recipe.recipe.title}
            </h4>

            {/* Only show first 3 ingredients */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {recipe.ingredients
                    .slice(0, 3)
                    .map((ing: string) => toSentenceCase(ing))
                    .join(", ")}
                {recipe.ingredients.length > 3 ? "..." : ""}
            </p>

            {/* Tags for mealType, diet, difficulty */}
            <div className="flex gap-2 flex-wrap text-xs">
                <Badge className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                    {toSentenceCase(recipe.mealType)}
                </Badge>
                <Badge className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {toSentenceCase(recipe.diet)}
                </Badge>
                <Badge className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {toSentenceCase(recipe.difficulty)}
                </Badge>
            </div>
        </Link>
    );
}
