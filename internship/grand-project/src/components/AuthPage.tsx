// "use client";

// import { useState } from "react";
// import { supabase } from "../app/api/lib/supabase";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2 } from "lucide-react";

// export default function AuthForm() {
//     const [email, setEmail] = useState("");
//     const [sent, setSent] = useState(false);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setSent(false);

//         const { error } = await supabase.auth.signInWithOtp({
//             email,
//             options: {
//                 // Redirect to the auth callback route to exchange the code for a session
//                 emailRedirectTo: `${location.origin}/auth/callback`,
//             },
//         });

//         setLoading(false);

//         if (error) {
//             setError(error.message);
//         } else {
//             setSent(true);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fcefe8] to-[#fff9f6] px-4 py-12">
//             <Card className="w-full max-w-md shadow-lg border border-orange-100 bg-white/80 backdrop-blur-sm rounded-xl">
//                 <CardHeader>
//                     <CardTitle className="text-3xl text-orange-600 font-bold text-center">
//                         Welcome to RecipeGen 🍲
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {sent ? (
//                         <p className="bg-green-100 text-green-700 border border-green-200 rounded-md px-4 py-2 text-sm text-center shadow-sm">
//                             Magic link sent! Check your email.
//                         </p>
//                     ) : (
//                         <form onSubmit={handleLogin} className="space-y-4">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 Enter your email to sign in:
//                             </label>
//                             <Input
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="you@example.com"
//                                 className="bg-white border border-orange-200 focus:ring-orange-500 focus:border-orange-500"
//                                 required
//                             />
//                             <Button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200">
//                                 {loading ? (
//                                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                                 ) : null}
//                                 {loading ? "Sending..." : "Send Magic Link"}
//                             </Button>
//                             {error && (
//                                 <p className="bg-red-100 text-red-700 border border-red-200 rounded-md px-4 py-2 text-sm text-center shadow-sm">
//                                     {error}
//                                 </p>
//                             )}
//                         </form>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

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
            console.log('Data:', data);
            console.log('Error:', error);
            authError = error;
            authData = data;
            if (!authError && authData.session) {
                console.log('Inside success if');
                setMessage("Logged in successfully!");
                localStorage.setItem('user-info', JSON.stringify(data));
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
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200">
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
