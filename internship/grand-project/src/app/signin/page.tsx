"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import AuthForm from "../../components/AuthPage";

export default function SignInPage() {
    const router = useRouter();

    useEffect(() => {
        const supabase = createPagesBrowserClient();

        // Check if the user is already logged in
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                router.push("/dashboard");
            }
        });
    }, []);

    return <AuthForm />;
}
