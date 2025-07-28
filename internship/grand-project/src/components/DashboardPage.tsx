// "use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Loader2, LogOut } from "lucide-react";
import { supabase } from "../app/api/lib/supabase";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
    const [ingredients, setIngredients] = useState<string>("");
    const [ingredientTags, setIngredientTags] = useState<string[]>([]);
    const [mealType, setMealType] = useState("");
    const [diet, setDiet] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState<any>(null);

    const router = useRouter();

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

    // const handleGenerate = async () => {
    //     setLoading(true);
    //     // Your logic to call API and generate recipe
    //     setTimeout(() => setLoading(false), 1500); // Simulate loading
    // };

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

            console.log("Generated Recipe:", data.recipe); // Later we'll display it below the form
            setRecipe(data.recipe);
        } catch (err) {
            console.error(err);
            alert("Failed to generate recipe. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex flex-col">
            {/* Topbar */}
            <header className="bg-[#fff7f2]">
                <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                    <h1 className="text-2xl font-bold text-orange-600">
                        🍽️ RecipeGen
                    </h1>
                    <nav className="space-x-6 hidden md:flex items-center text-gray-700 font-medium">
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" /> Logout
                        </Button>
                    </nav>
                </div>
                <div className="h-[1px] w-full bg-orange-100" />
            </header>

            {/* Main Content */}
            <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold text-orange-700 mb-6 text-center">
                    Generate Your Custom Recipe
                </h2>

                {/* Ingredients Input */}
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
                    <div className="flex flex-wrap gap-2">
                        {ingredientTags.map((tag, idx) => (
                            <Badge
                                key={idx}
                                onClick={() => handleRemoveTag(tag)}
                                className="bg-orange-200 text-orange-800 cursor-pointer hover:bg-orange-300">
                                {tag} ✕
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Dropdowns */}
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
                                <SelectItem value="dinner">Dinner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dietary Preference */}
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
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="text-center">
                    <Button
                        onClick={handleGenerate}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-semibold rounded-md"
                        disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "🔍 Generate Recipe"
                        )}
                    </Button>
                </div>
                {/* ✅ Recipe Card */}
                {recipe && (
                    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                        {/* ✅ Title & Tags */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-orange-700">
                                {recipe.title}
                            </h3>
                            <div className="flex gap-2">
                                {mealType && (
                                    <Badge className="bg-orange-100 text-orange-700">
                                        {mealType}
                                    </Badge>
                                )}
                                {diet && (
                                    <Badge className="bg-green-100 text-green-700">
                                        {diet}
                                    </Badge>
                                )}
                                {difficulty && (
                                    <Badge className="bg-blue-100 text-blue-700">
                                        {difficulty}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* ✅ Ingredients */}
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                                Ingredients:
                            </h4>
                            <ul className="list-disc list-inside text-gray-700">
                                {ingredientTags.map((ing, idx) => (
                                    <li key={idx}>{ing}</li>
                                ))}
                            </ul>
                        </div>

                        {/* ✅ Instructions */}
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                                Instructions:
                            </h4>
                            <ol className="list-decimal list-inside text-gray-700 space-y-1">
                                {recipe.instructions.map(
                                    (step: string, idx: number) => (
                                        <li key={idx}>{step}</li>
                                    )
                                )}
                            </ol>
                        </div>

                        {/* ✅ Cautions */}
                        <div>
                            <h4 className="text-lg font-semibold text-red-600">
                                Cautions:
                            </h4>
                            <ul className="list-disc list-inside text-red-500">
                                {recipe.cautions.map(
                                    (caution: string, idx: number) => (
                                        <li key={idx}>{caution}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
