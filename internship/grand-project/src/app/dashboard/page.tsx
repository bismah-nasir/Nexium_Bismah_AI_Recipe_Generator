"use client";

import DashboardPage from "@/components/DashboardPage";
import { useRouter } from "next/navigation";
export default function Page() {
    // MODIFIED LINE: Changed from `cookies: () => cookies()` back to `cookies` directly.
    // This is the standard and most robust way for createServerComponentClient in App Router.
    // const supabase = createServerComponentClient({ cookies });

    // const {
    //     data: { session },
    // } = await supabase.auth.getSession();
    const { session } = JSON.parse(localStorage.getItem("user-info")!);
    const router = useRouter();
    // console.log('Login session:', session);

    if (!session) {
        router.replace("/signin");
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">
                {/* Welcome to your dashboard, {session.user.email} */}
            </h1>
            <DashboardPage />
        </div>
    );
}
