"use client";

import { useEffect } from "react";
import DashboardPage from "@/components/DashboardPage";
import { useRouter } from "next/navigation";
export default function Page() {
    const router = useRouter();

    useEffect(() => {
        const { session } = JSON.parse(localStorage.getItem("user-info")!);

        if (!session) {
            router.replace("/signin");
        }
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
