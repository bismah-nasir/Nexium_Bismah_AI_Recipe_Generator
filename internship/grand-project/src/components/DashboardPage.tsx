"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ArrowRight, CookingPot, Loader2, ScrollText, Sparkles } from "lucide-react";
import { supabase } from "../app/api/lib/supabase";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PreviewCard from "@/components/PreviewCard";
import Navbar from "./Navbar";

export default function DashboardPage() {
    const [ingredients, setIngredients] = useState<string>("");
    const [ingredientTags, setIngredientTags] = useState<string[]>([]);
    const [mealType, setMealType] = useState("");
    const [diet, setDiet] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [loading, setLoading] = useState(false);
    const [recentRecipes, setRecentRecipes] = useState<any[]>([]);

    const router = useRouter();

    // Fetch last 3 recipes for the logged-in user
    useEffect(() => {
        async function fetchRecipes() {
            const email = JSON.parse(localStorage.getItem("user-info")!).session
                .user.email;
            const res = await fetch(`/api/recipes?userEmail=${email}&limit=3`);
            const data = await res.json();
            setRecentRecipes(data.recipes || []);
        }
        fetchRecipes();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/signin");
    };

    const handleAddIngredient = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && ingredients.trim()) {
            e.preventDefault();
            setIngredientTags((prev) => [...prev, ingredients.trim()]);
            setIngredients("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setIngredientTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleGenerate = async () => {
        if (ingredientTags.length === 0) {
            alert("Please add at least one ingredient!");
            return;
        }

        setLoading(true);

        try {
            // Get user email from stored session
            const sessionData = JSON.parse(localStorage.getItem("user-info")!);
            const userEmail = sessionData?.session?.user?.email;

            if (!userEmail) {
                alert("User not found. Please log in again.");
                return;
            }

            const response = await fetch("/api/generate-recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail,
                    ingredients: ingredientTags,
                    mealType,
                    diet,
                    difficulty,
                }),
            });

            const data = await response.json();

            if (!response.ok)
                throw new Error(data.error || "Something went wrong");

            // console.log("Generated Recipe:", data.recipe); // Later we'll display it below the form
            // setRecipe(data.recipe);

            // ✅ Redirect user to recipe page with recipeId
            router.push(`/recipe/${data.recipeId}`);
        } catch (err) {
            console.error(err);
            alert("Failed to generate recipe. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="min-h-screen bg-[#fff7f2]">
        //     {/* Navbar */}
        //     <Navbar isDashboard={true} onLogout={handleLogout} />

        //     {/* Main Content */}
        //     <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        //         <h2 className="text-3xl font-semibold text-orange-700 mb-6 text-center">
        //             Generate Your Custom Recipe
        //         </h2>

        //         {/* Ingredients Input */}
        //         <div className="mb-6">
        //             <label className="block mb-2 text-sm font-medium text-gray-700">
        //                 Ingredients (press Enter to add)
        //             </label>
        //             <Input
        //                 value={ingredients}
        //                 onChange={(e) => setIngredients(e.target.value)}
        //                 onKeyDown={handleAddIngredient}
        //                 placeholder="e.g., chicken, rice, garlic"
        //                 className="mb-2"
        //             />
        //             <div className="flex flex-wrap gap-2">
        //                 {ingredientTags.map((tag, idx) => (
        //                     <Badge
        //                         key={idx}
        //                         onClick={() => handleRemoveTag(tag)}
        //                         className="bg-orange-200 text-orange-800 cursor-pointer hover:bg-orange-300">
        //                         {tag} ✕
        //                     </Badge>
        //                 ))}
        //             </div>
        //         </div>

        //         {/* Dropdowns */}
        //         <div className="grid sm:grid-cols-3 gap-4 mb-6">
        //             {/* Meal Type */}
        //             <div>
        //                 <label className="block mb-2 text-sm font-medium text-gray-700">
        //                     Meal Type
        //                 </label>
        //                 <Select onValueChange={setMealType}>
        //                     <SelectTrigger className="bg-white">
        //                         <SelectValue placeholder="Select type" />
        //                     </SelectTrigger>
        //                     <SelectContent>
        //                         <SelectItem value="breakfast">
        //                             Breakfast
        //                         </SelectItem>
        //                         <SelectItem value="lunch">Lunch</SelectItem>
        //                         <SelectItem value="dinner">Dinner</SelectItem>
        //                     </SelectContent>
        //                 </Select>
        //             </div>

        //             {/* Dietary Preference */}
        //             <div>
        //                 <label className="block mb-2 text-sm font-medium text-gray-700">
        //                     Dietary Preference
        //                 </label>
        //                 <Select onValueChange={setDiet}>
        //                     <SelectTrigger className="bg-white">
        //                         <SelectValue placeholder="Select diet" />
        //                     </SelectTrigger>
        //                     <SelectContent>
        //                         <SelectItem value="vegetarian">
        //                             Vegetarian
        //                         </SelectItem>
        //                         <SelectItem value="vegan">Vegan</SelectItem>
        //                         <SelectItem value="keto">Keto</SelectItem>
        //                     </SelectContent>
        //                 </Select>
        //             </div>

        //             {/* Difficulty */}
        //             <div>
        //                 <label className="block mb-2 text-sm font-medium text-gray-700">
        //                     Difficulty
        //                 </label>
        //                 <Select onValueChange={setDifficulty}>
        //                     <SelectTrigger className="bg-white">
        //                         <SelectValue placeholder="Select level" />
        //                     </SelectTrigger>
        //                     <SelectContent>
        //                         <SelectItem value="easy">Easy</SelectItem>
        //                         <SelectItem value="medium">Medium</SelectItem>
        //                         <SelectItem value="hard">Hard</SelectItem>
        //                     </SelectContent>
        //                 </Select>
        //             </div>
        //         </div>

        //         {/* Generate Button */}
        //         <div className="text-center">
        //             <Button
        //                 onClick={handleGenerate}
        //                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-semibold rounded-md"
        //                 disabled={loading}>
        //                 {loading ? (
        //                     <Loader2 className="h-5 w-5 animate-spin" />
        //                 ) : (
        //                     "🔍 Generate Recipe"
        //                 )}
        //             </Button>
        //         </div>

        //         {/* ✅ Preview Section */}
        //         <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        //             📜 Your Recent Recipes
        //         </h3>
        //         {recentRecipes.length === 0 ? (
        //             <p className="text-gray-600 text-sm">
        //                 No recipes yet. Generate one to see it here!
        //             </p>
        //         ) : (
        //             <div className="grid md:grid-cols-3 gap-4">
        //                 {recentRecipes.map((recipe: any) => (
        //                     // <Link
        //                     //     key={recipe._id}
        //                     //     href={`/recipes/${recipe._id}`}
        //                     //     className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
        //                     //     <h4 className="text-lg font-semibold text-orange-600 mb-1">
        //                     //         {recipe.recipe.title}
        //                     //     </h4>
        //                     //     <p className="text-gray-600 text-sm line-clamp-2 mb-2">
        //                     //         {recipe.ingredients.join(", ")}
        //                     //     </p>
        //                     //     <div className="flex gap-2 flex-wrap text-xs">
        //                     //         <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
        //                     //             {recipe.mealType}
        //                     //         </span>
        //                     //         <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
        //                     //             {recipe.diet}
        //                     //         </span>
        //                     //         <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
        //                     //             {recipe.difficulty}
        //                     //         </span>
        //                     //     </div>
        //                     // </Link>
        //                     <PreviewCard key={recipe._id} recipe={recipe} />
        //                 ))}
        //             </div>
        //         )}

        //         {/* 🔵 Load More */}
        //         <div className="text-center mt-6">
        //             <Link
        //                 href="/recipes"
        //                 className="text-orange-600 hover:underline font-medium">
        //                 🔗 Load More Recipes →
        //             </Link>
        //         </div>
        //     </main>
        // </div>

        <div className="min-h-screen bg-[#fff9f5]">
            {/* ✅ Navbar */}
            <Navbar isDashboard={true} onLogout={handleLogout} />

            {/* ✅ Two-Column Layout */}
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* ✅ LEFT COLUMN — Recipe Generator Form */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center">
                        <CookingPot className="w-6 h-6 mr-2" />
                        Generate Your Custom Recipe
                    </h2>

                    {/* ✅ Ingredients Input */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Ingredients (press Enter to add)
                        </label>
                        <Input
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            onKeyDown={handleAddIngredient}
                            placeholder="e.g., chicken, rice, garlic"
                            className="mb-2"
                        />

                        {/* ✅ Ingredient Tags wrap neatly */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {ingredientTags.map((tag, idx) => (
                                <Badge
                                    key={idx}
                                    onClick={() => handleRemoveTag(tag)}
                                    className="bg-orange-100 text-orange-700 cursor-pointer hover:bg-orange-200">
                                    {tag} ✕
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Dropdowns */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                        {/* Meal Type */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Meal Type
                            </label>
                            <Select onValueChange={setMealType}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="breakfast">
                                        Breakfast
                                    </SelectItem>
                                    <SelectItem value="lunch">Lunch</SelectItem>
                                    <SelectItem value="dinner">
                                        Dinner
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Diet */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Dietary Preference
                            </label>
                            <Select onValueChange={setDiet}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select diet" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vegetarian">
                                        Vegetarian
                                    </SelectItem>
                                    <SelectItem value="vegan">Vegan</SelectItem>
                                    <SelectItem value="keto">Keto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Difficulty
                            </label>
                            <Select onValueChange={setDifficulty}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ✅ Generate Button */}
                    <div className="text-center">
                        <Button
                            onClick={handleGenerate}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-semibold rounded-md cursor-pointer"
                            disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 inline-block" />
                                    Generate Recipe
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* ✅ RIGHT COLUMN — Recent Recipes */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ScrollText className="h-6 w-6 text-orange-600" />
                        Your Recent Recipes
                    </h3>

                    {/* ✅ Show Recipes */}
                    {recentRecipes.length === 0 ? (
                        <p className="text-gray-600 text-sm">
                            No recipes yet. Generate one to see it here!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {recentRecipes.map((recipe: any) => (
                                <PreviewCard key={recipe._id} recipe={recipe} />
                            ))}
                        </div>
                    )}

                    {/* ✅ Load More Button */}
                    <Link
                        href="/recipes"
                        className="block text-center mt-4 text-orange-600 hover:underline font-medium flex items-center justify-center gap-2">
                        Load More Recipes
                        <ArrowRight className="h-4 w-4 mt-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
