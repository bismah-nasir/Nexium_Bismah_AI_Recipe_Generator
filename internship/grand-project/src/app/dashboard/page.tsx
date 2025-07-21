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

// app/dashboard/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect("/signin");
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                Welcome to your dashboard, {session.user.email}
            </h1>
        </div>
    );
}
