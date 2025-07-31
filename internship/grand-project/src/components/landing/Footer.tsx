import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { ChefHat } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-orange-500 text-white mt-16">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* 🔹 Top section: Logo + Links */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    {/* Logo */}
                    <div className="flex items-center mb-4 md:mb-0">
                        <ChefHat className="h-6 w-6 mr-2" />
                        <span className="text-2xl font-bold tracking-wide">
                            RecipeGen
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex space-x-6 text-sm">
                        <Link href="#about" className="hover:underline">
                            About Us
                        </Link>
                        <Link href="#how-it-works" className="hover:underline">
                            How it Works
                        </Link>
                        <Link href="#features" className="hover:underline">
                            Features
                        </Link>
                        <Link href="/signin" className="hover:underline">
                            Sign In
                        </Link>
                    </nav>
                </div>

                {/* 🔹 Divider line */}
                <div className="border-t border-orange-400 my-6"></div>

                {/* 🔹 Bottom section: Social icons + Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                    {/* Social Icons */}
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <a href="#" className="hover:text-orange-200">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="hover:text-orange-200">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="hover:text-orange-200">
                            <Facebook className="h-5 w-5" />
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-orange-100">
                        © {new Date().getFullYear()} RecipeGen. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
