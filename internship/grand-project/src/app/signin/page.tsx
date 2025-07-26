// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
// import AuthForm from "../../components/AuthPage";

// export default function SignInPage() {
//     const router = useRouter();

//     useEffect(() => {
//         const supabase = createPagesBrowserClient();

//         // Check if the user is already logged in
//         supabase.auth.getUser().then(({ data: { user } }) => {
//             if (user) {
//                 router.push("/dashboard");
//             }
//         });
//     }, []);

//     return <AuthForm />;
// }

// app/signin/page.tsx
"use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import AuthForm from "../../components/AuthPage";

export default function SignInPage() {
    // const router = useRouter();

    // REMOVED: The useEffect that redirects if a session exists.
    // This check is better handled by middleware or the dashboard page itself.
    // Keeping it here can sometimes cause redirect loops or unexpected behavior
    // when switching authentication methods or if the session isn't immediately
    // available on client-side after a server-side redirect.

    return <AuthForm />;
}
