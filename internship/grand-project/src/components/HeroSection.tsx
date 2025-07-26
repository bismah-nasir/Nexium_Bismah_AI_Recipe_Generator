import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="bg-[#fff7f2] py-16 px-6">
            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
                {/* Left Side */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
                        AI-Powered Recipe Generator 🍲
                    </h1>
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
                        src="/images/chef-ai.jpg"
                        alt="AI Chef Cooking"
                        width={450}
                        height={450}
                        className="rounded-full shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
