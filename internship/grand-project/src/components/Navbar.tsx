"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <header className="bg-[#fff7f2]">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                <div className="text-2xl font-bold text-orange-600 tracking-wide">
                    🍽️ RecipeGen
                </div>
                <nav className="space-x-6 hidden md:flex items-center text-gray-700 font-medium">
                    <a href="#about" className="hover:text-orange-600">
                        About Us
                    </a>
                    <a href="#how-it-works" className="hover:text-orange-600">
                        How it Works
                    </a>
                    <a href="#features" className="hover:text-orange-600">
                        Features
                    </a>
                    <a href="#pricing" className="hover:text-orange-600">
                        Pricing
                    </a>
                    <Link
                        href="/signin"
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
                        Sign In
                    </Link>
                </nav>
            </div>
            <div className="h-[1px] w-full bg-orange-100" />
        </header>
    );
}
