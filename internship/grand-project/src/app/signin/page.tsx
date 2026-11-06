"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/AuthPage";
import { getUserEmail } from "../api/lib/supabase";

export default function SignInPage() {
    const router = useRouter();

    // Already logged in? Skip the form.
    useEffect(() => {
        getUserEmail().then((email) => {
            if (email) router.replace("/dashboard");
        });
    }, []);

    return <AuthForm />;
}
