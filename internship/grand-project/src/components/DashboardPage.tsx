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
import {
    ArrowRight,
    CookingPot,
    Loader2,
    ScrollText,
    Sparkles,
} from "lucide-react";
import { supabase, signOut, authFetch } from "../app/api/lib/supabase";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PreviewCard from "@/components/PreviewCard";
import Navbar from "./Navbar";
import AlertModal, { type AlertInfo } from "./AlertModal";

export default function DashboardPage() {
    const [ingredients, setIngredients] = useState<string>("");
    const [ingredientTags, setIngredientTags] = useState<string[]>([]);
    const [mealType, setMealType] = useState("");
    const [diet, setDiet] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [loading, setLoading] = useState(false);
    const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
    const [recipesLoading, setRecipesLoading] = useState(true);
    const [recipesError, setRecipesError] = useState(false);
    const [alertInfo, setAlertInfo] = useState<AlertInfo | null>(null);

    const router = useRouter();

    // Fetch last 3 recipes for the logged-in user
    async function fetchRecipes() {
        setRecipesError(false);
        try {
            const res = await authFetch("/api/recipes?limit=3");
            if (res.status === 401) return; // authFetch is redirecting to sign in
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            setRecentRecipes(data.recipes || []);
        } catch (err) {
            console.warn("Failed to load recent recipes:", err);
            setRecipesError(true);
        } finally {
            setRecipesLoading(false);
        }
    }

    // Load recipes once Supabase has a session. Listening for auth events (instead of
    // checking once on mount) avoids showing an empty list right after signing in,
    // before the session is ready.
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session && (event === "INITIAL_SESSION" || event === "SIGNED_IN")) {
                // Deferred: Supabase advises against calling its API inside this callback
                setTimeout(fetchRecipes, 0);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut();
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
            setAlertInfo({
                title: "No ingredients yet",
                message:
                    "Add at least one ingredient (type it and press Enter) so we know what to cook with.",
                variant: "warning",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await authFetch("/api/generate-recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ingredients: ingredientTags,
                    mealType,
                    diet,
                    difficulty,
                }),
            });

            if (response.status === 401) return; // authFetch is redirecting to sign in
            const data = await response.json();

            // The ingredients need changing, so retrying won't help
            if (response.status === 400 || response.status === 422) {
                setAlertInfo({
                    title: "Let's try different ingredients",
                    message: data.error,
                    variant: "warning",
                });
                return;
            }

            if (!response.ok)
                throw new Error(data.error || "Something went wrong");

            // ✅ Redirect user to recipe page with recipeId
            router.push(`/recipes/${data.recipeId}?from=dashboard`);
        } catch (err) {
            console.warn("Failed to generate recipe:", err);
            setAlertInfo({
                title: "Couldn't generate your recipe",
                message:
                    "Something went wrong while creating your recipe. Please try again in a moment.",
                variant: "error",
                actionLabel: "Try again",
                onAction: handleGenerate,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff9f5]">
            {/* ✅ Navbar */}
            <Navbar isDashboard={true} onLogout={handleLogout} />
            <AlertModal alert={alertInfo} onClose={() => setAlertInfo(null)} />

            {/* ✅ Two-Column Layout */}
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 md:items-start gap-8">
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
                                <SelectTrigger className="bg-white w-full">
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
                                <SelectTrigger className="bg-white w-full">
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
                                <SelectTrigger className="bg-white w-full">
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
                    {recipesLoading ? (
                        <p className="text-gray-600 text-sm flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                            Loading your recipes...
                        </p>
                    ) : recipesError ? (
                        <p className="text-red-700 text-sm">
                            Couldn&apos;t load your recipes.{" "}
                            <button
                                onClick={fetchRecipes}
                                className="underline font-medium cursor-pointer">
                                Try again
                            </button>
                        </p>
                    ) : recentRecipes.length === 0 ? (
                        <p className="text-gray-600 text-sm">
                            No recipes yet. Generate one to see it here!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {recentRecipes.map((recipe: any) => (
                                // <PreviewCard
                                //     key={recipe._id}
                                //     recipe={recipe}
                                //     variant="peach"
                                // />
                                <PreviewCard key={recipe._id} recipe={recipe} from="dashboard" variant="peach" />

                            ))}
                        </div>
                    )}

                    {/* ✅ Load More Button */}
                    <Link
                        href="/recipes"
                        className="text-center mt-4 text-orange-600 hover:underline font-medium flex items-center justify-center gap-2">
                        Load More Recipes
                        <ArrowRight className="h-4 w-4 mt-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
