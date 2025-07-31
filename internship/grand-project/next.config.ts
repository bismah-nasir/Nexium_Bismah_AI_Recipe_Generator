import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // ✅ Skip ESLint errors on Vercel
    },
    typescript: {
        ignoreBuildErrors: true, // ✅ Skip TypeScript errors on Vercel
    },
};

export default nextConfig;
