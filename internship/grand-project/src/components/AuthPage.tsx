// components/AuthPage.tsx
"use client";

import { useState } from "react";
import { supabase } from "../app/api/lib/supabase"; // Assuming this path is correct for your project structure
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // New state for password
    const [isSigningUp, setIsSigningUp] = useState(false); // To toggle between sign-in/sign-up
    const [message, setMessage] = useState(""); // For success/error messages
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter(); // Initialize router

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        let authError = null;
        let authData = null;

        if (isSigningUp) {
            // Attempt to sign up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`, // Still good practice for email confirmation
                },
            });
            authError = error;
            authData = data;
            if (!authError && authData.user) {
                setMessage(
                    "Sign-up successful! Please check your email for a confirmation link (if email confirmation is required by Supabase). You can now log in."
                );
                setIsSigningUp(false); // Switch to login after sign-up
            }
        } else {
            // Attempt to sign in
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            console.log("Data:", data);
            console.log("Error:", error);
            authError = error;
            authData = data;
            if (!authError && authData.session) {
                console.log("Inside success if");
                setMessage("Logged in successfully!");
                localStorage.setItem("user-info", JSON.stringify(data));
                router.push("/dashboard"); // Redirect on successful login
            }
        }

        setLoading(false);

        if (authError) {
            setError(authError.message);
        } else if (!authData.user && !authData.session && isSigningUp) {
            // If sign-up succeeded but no user/session immediately (e.g., email confirmation needed)
            setMessage(
                "Sign-up successful! Please check your email for a confirmation link. You can now log in."
            );
        } else if (!authData.session && !isSigningUp) {
            // If sign-in failed and not signing up, likely wrong credentials
            setError(
                "Login failed. Please check your email and password, or sign up if you don't have an account."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fcefe8] to-[#fff9f6] px-4 py-12">
            <Card className="w-full max-w-md shadow-lg border border-orange-100 bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader>
                    <CardTitle className="text-3xl text-orange-600 font-bold text-center">
                        Welcome to RecipeGen 🍲
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-white border border-orange-200 focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                        <label className="block text-sm font-medium text-gray-700">
                            Password:
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-white border border-orange-200 focus:ring-orange-500 focus:border-orange-500"
                            required
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200 cursor-pointer">
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            {isSigningUp ? "Sign Up" : "Sign In"}
                        </Button>

                        {message && (
                            <p className="bg-green-100 text-green-700 border border-green-200 rounded-md px-4 py-2 text-sm text-center shadow-sm">
                                {message}
                            </p>
                        )}
                        {error && (
                            <p className="bg-red-100 text-red-700 border border-red-200 rounded-md px-4 py-2 text-sm text-center shadow-sm">
                                {error}
                            </p>
                        )}
                    </form>
                    <div className="mt-4 text-center">
                        <Button
                            variant="link"
                            onClick={() => setIsSigningUp(!isSigningUp)}
                            className="text-orange-600 hover:text-orange-700">
                            {isSigningUp
                                ? "Already have an account? Sign In"
                                : "Don't have an account? Sign Up"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// "use client";

// import { useState } from "react";
// import { Mail } from "lucide-react";
// import { supabase } from "../app/api/lib/supabase";

// export default function SignInPage() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     setError("");

//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
//     });

//     setLoading(false);

//     if (error) {
//       setError(error.message);
//     } else {
//       setMessage("Magic link sent! Check your email.");
//       setEmail("");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#fff7f2] px-4">
//       <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
//         {/* Icon */}
//         <div className="flex justify-center">
//           <div className="bg-orange-100 p-4 rounded-full">
//             <Mail className="h-8 w-8 text-orange-600" />
//           </div>
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-bold text-center mt-4">Welcome back</h1>
//         <p className="text-gray-600 text-center text-sm mb-6">
//           Enter your email to receive a magic login link
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSignIn} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email address
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="Enter your email"
//               className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition"
//           >
//             {loading ? "Sending..." : "Send Magic Link"}
//           </button>
//         </form>

//         {/* Messages */}
//         {message && (
//           <p className="mt-4 text-center bg-green-50 text-green-700 p-2 rounded-md text-sm">
//             {message}
//           </p>
//         )}
//         {error && (
//           <p className="mt-4 text-center bg-red-50 text-red-700 p-2 rounded-md text-sm">
//             {error}
//           </p>
//         )}

//         {/* Info text */}
//         <p className="text-gray-500 text-xs text-center mt-6">
//           We’ll send you a secure login link. No password required!
//         </p>
//       </div>
//     </div>
//   );
// }
