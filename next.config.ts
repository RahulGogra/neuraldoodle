import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn-icons-png.flaticon.com",
                port: "",
                pathname: "/512/**", // ✅ Allows all images in /512/ folder
            },
        ],
    },
};

export default nextConfig;
