// "use client";

// import Link from "next/link";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// export default function PreviewCard({ recipe }: { recipe: any }) {
//     return (
//         <Link href={`/recipes/${recipe._id}`}>
//             <Card className="p-4 bg-white shadow-md hover:shadow-lg transition rounded-lg cursor-pointer">
//                 {/* Title */}
//                 <h3 className="text-lg font-semibold text-orange-700">
//                     {recipe.recipe.title}
//                 </h3>

//                 {/* Ingredients (just a few) */}
//                 <p className="text-sm text-gray-600 mt-1">
//                     {recipe.ingredients.slice(0, 3).join(", ")}
//                     {recipe.ingredients.length > 3 ? "..." : ""}
//                 </p>

//                 {/* Tags */}
//                 <div className="flex gap-2 mt-3">
//                     <Badge className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
//                         {recipe.mealType}
//                     </Badge>
//                     <Badge className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
//                         {recipe.diet}
//                     </Badge>
//                     <Badge className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
//                         {recipe.difficulty}
//                     </Badge>
//                 </div>
//             </Card>
//         </Link>
//     );
// }

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toSentenceCase } from "@/lib/format";

export default function PreviewCard({ recipe }: { recipe: any }) {
    return (
        <Link
            href={`/recipes/${recipe._id}`}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            {/* Recipe Title */}
            <h4 className="text-lg font-semibold text-orange-600 mb-1">
                {recipe.recipe.title}
            </h4>

            {/* Only show first 3 ingredients */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {recipe.ingredients.slice(0, 3)
                .map((ing) => toSentenceCase(ing))
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
