"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PreviewCard from "@/components/PreviewCard";
import Navbar from "@/components/Navbar";
import { ChefHat, ArrowLeft } from "lucide-react";
import { supabase } from "../api/lib/supabase";
import { useRouter } from "next/navigation";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const router = useRouter();

    // ✅ Handle logout for navbar
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/signin");
    };

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
        <div className="min-h-screen bg-[#fff7f2]">
            {/* Navbar */}
            <Navbar isDashboard={true} onLogout={handleLogout} />

            <div className="px-6 py-10 max-w-7xl mx-auto">
                {/* Title Section */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <ChefHat className="h-8 w-8 text-orange-600" />
                    <h2 className="text-3xl font-bold text-orange-700">
                        All Your Recipes
                    </h2>
                </div>

                {/* Recipes Grid */}
                {recipes.length === 0 ? (
                    <p className="text-gray-600 text-center">
                        No recipes found.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <PreviewCard
                                key={recipe._id}
                                recipe={recipe}
                                from="recipes"
                                variant="white"
                            />
                        ))}
                    </div>
                )}

                {/* Back Button */}
                <div className="text-center mt-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-orange-500 text-white font-medium px-6 py-2 rounded-md hover:bg-orange-600 transition cursor-pointer">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
