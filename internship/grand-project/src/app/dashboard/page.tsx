"use client";

import { useEffect } from "react";
import DashboardPage from "@/components/DashboardPage";
import { useRouter } from "next/navigation";
import { getUserEmail } from "../api/lib/supabase";
export default function Page() {
    const router = useRouter();

    useEffect(() => {
        getUserEmail().then((email) => {
            if (!email) {
                router.replace("/signin");
            }
        });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">
                {/* Welcome to your dashboard, {session.user.email} */}
            </h1>
            <DashboardPage />
        </div>
    );
}
