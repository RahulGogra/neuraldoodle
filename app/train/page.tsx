"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

// 🔄 Animated Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <motion.div
            className="w-12 h-12 border-4 border-[#9ACBD0] border-t-[#48A6A7] rounded-full animate-spin"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="mt-4 text-[#006A71] font-semibold">
            Loading Teachable Machine...
        </p>
    </div>
);

// 🔄 Dynamically Load `TeachableMachine`
const TeachableMachine = dynamic(
    () => import("@/components/teachableMachine"),
    {
        loading: () => <LoadingSpinner />, // Use the animated spinner while loading
        ssr: false,
    }
);

export default function Train() {
    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-b from-[#F2EFE7] to-[#DDEDEB] min-h-screen mt-10 pt-10">
                <motion.h1
                    className="text-5xl font-bold text-[#006A71] text-center mt-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Train Your AI Model
                </motion.h1>
                <p className="text-gray-700 text-center mt-2 max-w-2xl mx-auto">
                    Use Teachable Machine to train and test your AI model in
                    real-time.
                </p>

                <TeachableMachine />
            </div>
        </>
    );
}
