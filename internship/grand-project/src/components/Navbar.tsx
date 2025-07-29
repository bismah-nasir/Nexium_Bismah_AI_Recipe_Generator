"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function Navbar({
    isDashboard = false,
    onLogout,
}: {
    isDashboard?: boolean;
    onLogout?: () => void;
}) {
    return (
        <header className="bg-[#fff7f2]">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                <div className="flex items-center text-2xl font-bold text-orange-600 tracking-wide">
                    <ChefHat className="h-6 w-6 mr-2" />
                    RecipeGen
                </div>
                <nav className="space-x-6 hidden md:flex items-center text-gray-700 font-medium">
                    {isDashboard ? (
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
                            Log Out
                        </button>
                    ) : (
                        <>
                            <a href="#about" className="hover:text-orange-600">
                                About Us
                            </a>
                            <a
                                href="#how-it-works"
                                className="hover:text-orange-600">
                                How It Works
                            </a>
                            <a
                                href="#features"
                                className="hover:text-orange-600">
                                Features
                            </a>
                            <Link
                                href="/signin"
                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
                                Sign In
                            </Link>
                        </>
                    )}
                </nav>
            </div>
            <div className="h-[1px] w-full bg-orange-100" />
        </header>
    );
}
