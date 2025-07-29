import { WandSparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="bg-[#fff7f2] py-16 px-10">
            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 px-6">
                {/* Left Side */}
                <div className="md:w-1/2 text-center md:text-left">
                    <div className="flex text-2xl font-bold tracking-wide text-gray-800">
                        <WandSparkles className="h-10 w-10 mr-2 mt-3" />
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                            AI-Powered Recipe Generator
                        </h1>
                    </div>

                    <p className="text-lg text-gray-600 mb-8">
                        Tired of figuring out what to cook? RecipeGen uses AI to
                        craft personalized recipes based on your preferences and
                        ingredients.
                    </p>
                    <Link href="/signin">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition cursor-pointer">
                            Generate Your First Recipe
                        </button>
                    </Link>
                </div>

                {/* Right Side */}
                <div className="md:w-1/2 flex justify-center">
                    <Image
                        src="/images/chef.png"
                        alt="AI Chef Cooking"
                        width={350}
                        height={350}
                    />
                </div>
            </div>
        </section>
    );
}
