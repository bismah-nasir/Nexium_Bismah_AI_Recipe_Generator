"use client";

import DashboardPage from "@/components/DashboardPage";
import { useRouter } from "next/navigation";

// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//     const supabase = createServerComponentClient({ cookies });

//     const {
//         // data: { session },
//         data,
//     } = await supabase.auth.getSession();

//     console.log("SESSION:", data);

//     // if (!session) {
//     //     // User not signed in, redirect to signin
//     //     redirect("/signin");
//     // }

//     return (
//         <div>
//             {/* Your Dashboard UI Here */}
//             <h1 className="text-2xl font-semibold text-center mt-6">
//                 {/* Welcome to RecipeGen, {session?.user?.email}! */}
//             </h1>
//             {/* ... other components */}
//         </div>
//     );
// }

// // app/dashboard/page.tsx
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//     const supabase = createServerComponentClient({ cookies });

//     const {
//         data: { session },
//     } = await supabase.auth.getSession();

//     if (!session) {
//         redirect("/signin");
//     }

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold">
//                 Welcome to your dashboard, {session.user.email}
//             </h1>
//         </div>
//     );
// }

// // app/dashboard/page.tsx
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//     // FIX: Explicitly call cookies() to get the instance and pass it as a function.
//     // This resolves the "cookies() should be awaited" error in server components.
//     const supabase = createServerComponentClient({ cookies: () => cookies() });

//     const {
//         data: { session },
//     } = await supabase.auth.getSession();

//     if (!session) {
//         redirect("/signin");
//     }

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold">
//                 Welcome to your dashboard, {session.user.email}
//             </h1>
//         </div>
//     );
// }


// app/dashboard/page.tsx
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export default function Page() {
    // MODIFIED LINE: Changed from `cookies: () => cookies()` back to `cookies` directly.
    // This is the standard and most robust way for createServerComponentClient in App Router.
    // const supabase = createServerComponentClient({ cookies });

    // const {
    //     data: { session },
    // } = await supabase.auth.getSession();
    const {session} = JSON.parse(localStorage.getItem('user-info')!);
    const router = useRouter();
    // console.log('Login session:', session);

    if (!session) {
        router.replace("/signin");
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                {/* Welcome to your dashboard, {session.user.email} */}
            </h1>
            <DashboardPage />
        </div>
    );
}