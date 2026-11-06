import Link from "next/link";
import { ChefHat, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff7f2] px-6 text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
                <ChefHat className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-5xl font-extrabold text-orange-600 mb-2">404</h1>
            <p className="text-lg text-gray-700 mb-6">
                Looks like this page isn&apos;t on the menu.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 bg-orange-500 text-white font-medium px-6 py-2 rounded-md hover:bg-orange-600 transition">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>
        </div>
    );
}
