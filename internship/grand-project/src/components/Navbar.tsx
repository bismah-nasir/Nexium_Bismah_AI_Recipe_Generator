"use client";

import { useState } from "react";
import Link from "next/link";
import { ChefHat, LogIn, LogOut, Menu, X } from "lucide-react";

export default function Navbar({
    isDashboard = false,
    onLogout,
}: {
    isDashboard?: boolean;
    onLogout?: () => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    // Shared between the desktop nav and the mobile dropdown
    const links = isDashboard ? (
        <button
            onClick={() => {
                closeMenu();
                onLogout?.();
            }}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition cursor-pointer">
            <LogOut className="h-4 w-4" /> Sign Out
        </button>
    ) : (
        <>
            <a href="#about" onClick={closeMenu} className="hover:text-orange-600">
                About Us
            </a>
            <a
                href="#how-it-works"
                onClick={closeMenu}
                className="hover:text-orange-600">
                How It Works
            </a>
            <a
                href="#features"
                onClick={closeMenu}
                className="hover:text-orange-600">
                Features
            </a>
            <Link
                href="/signin"
                onClick={closeMenu}
                className="flex items-center justify-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
                <LogIn className="h-4 w-4" /> Sign In
            </Link>
        </>
    );

    return (
        <header className="bg-[#fff7f2]">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                <Link
                    href={isDashboard ? "/dashboard" : "/"}
                    className="flex items-center text-2xl font-bold text-orange-600 tracking-wide">
                    <ChefHat className="h-6 w-6 mr-2" />
                    RecipeGen
                </Link>
                <nav className="space-x-6 hidden md:flex items-center text-gray-700 font-medium">
                    {links}
                </nav>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    className="md:hidden p-2 text-orange-600 rounded-md hover:bg-orange-100 cursor-pointer">
                    {menuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>
            {menuOpen && (
                <nav className="md:hidden flex flex-col gap-4 px-6 pb-4 text-gray-700 font-medium">
                    {links}
                </nav>
            )}
            <div className="h-[1px] w-full bg-orange-100" />
        </header>
    );
}
