"use client";

import { useState } from "react";
import { supabase } from "../app/api/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSent(false);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/dashboard`,
            },
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
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
                    {sent ? (
                        <p className="bg-green-100 text-green-700 border border-green-200 rounded-md px-4 py-2 text-sm text-center shadow-sm">
                            Magic link sent! Check your email.
                        </p>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Enter your email to sign in:
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
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
                                {loading ? "Sending..." : "Send Magic Link"}
                            </Button>
                            {error && (
                                <p className="bg-red-100 text-red-700 border border-red-200 rounded-md px-4 py-2 text-sm text-center shadow-sm">
                                    {error}
                                </p>
                            )}
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
