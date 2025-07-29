import { ClipboardList, Bot, Utensils } from "lucide-react";

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-[#fff7f2] py-16">
            <div className="max-w-7xl mx-auto px-6 text-center">
                {/* Heading */}
                <h2 className="text-3xl font-bold text-gray-800 mb-10">
                    How It Works
                </h2>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-3 gap-10">
                    {/* Step 1 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                        <div className="bg-orange-100 text-orange-600 p-4 rounded-full inline-block mb-4">
                            <ClipboardList className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            1. Enter Ingredients
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Type in what you have at home — from chicken to
                            spices — and choose your preferences.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                        <div className="bg-orange-100 text-orange-600 p-4 rounded-full inline-block mb-4">
                            <Bot className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            2. AI Creates Recipe
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Our AI analyzes your ingredients & dietary choices
                            to craft a unique recipe for you.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                        <div className="bg-orange-100 text-orange-600 p-4 rounded-full inline-block mb-4">
                            <Utensils className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            3. Cook & Enjoy
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Follow the easy step-by-step instructions & enjoy
                            your personalized dish.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
