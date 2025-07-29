import { Sparkles, Clock, Heart, PieChart } from "lucide-react";

export default function Features() {
    return (
        <section id="features" className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-6 text-center">
                {/* Heading */}
                <h2 className="text-3xl font-bold text-orange-600 mb-10">
                    Features of RecipeGen
                </h2>

                {/* Features Grid */}
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-[#fff1e6] p-6 rounded-xl shadow hover:shadow-lg transition">
                        <div className="bg-white text-orange-600 p-4 rounded-full inline-block mb-4">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            AI-Powered Recipes
                        </h3>
                        <p className="text-gray-700 text-sm">
                            Uses advanced AI to generate recipes based on your
                            ingredients, preferences, and diet.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#fff1e6] p-6 rounded-xl shadow hover:shadow-lg transition">
                        <div className="bg-white text-orange-600 p-4 rounded-full inline-block mb-4">
                            <Clock className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Quick & Easy
                        </h3>
                        <p className="text-gray-700 text-sm">
                            Get recipes in seconds with simple instructions
                            designed for all skill levels.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#fff1e6] p-6 rounded-xl shadow hover:shadow-lg transition">
                        <div className="bg-white text-orange-600 p-4 rounded-full inline-block mb-4">
                            <Heart className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Personalized Choices
                        </h3>
                        <p className="text-gray-700 text-sm">
                            Takes your dietary preferences and restrictions into
                            account for every recipe.
                        </p>
                    </div>

                    {/* Feature 4 (Nutritional Breakdown) */}
                    <div className="bg-[#fff1e6] p-6 rounded-xl shadow hover:shadow-lg transition">
                        <div className="bg-white text-orange-600 p-4 rounded-full inline-block mb-4">
                            <PieChart className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Nutritional Breakdown
                        </h3>
                        <p className="text-gray-700 text-sm">
                            Future-ready: Each recipe will show calories,
                            macros, and other key nutritional info.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
