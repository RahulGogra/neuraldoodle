"use client";

import Navbar from "@/utils/navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        name: "",
        role: "",
        email: "",
        updatedAt: "",
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
            setLoading(false); // Done loading
        } else {
            toast.error("User not logged In.");
            router.push("/auth"); // Redirect if not logged in
        }
    }, [router]);

    if (loading)
        return (
            <div className="text-center pt-20 bg-[#F2EFE7] h-screen w-screen text-3xl justify-center">
                Checking auth...
            </div>
        );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/"); // or wherever your login page is
    };

    return (
        <>
            <Navbar />
            <div className="bg-[#F2EFE7] h-screen">
                <motion.div
                    className="max-w-2xl mx-auto p-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-[#9ACBD0] p-6 mt-20">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative w-32 h-32">
                                <Image
                                    src="/profile.jpg"
                                    alt="Profile Picture"
                                    fill
                                    className={
                                        "rounded-full border-4 border-[#48A6A7]"
                                    }
                                    style={{ objectFit: "cover" }}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>

                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-[#006A71]">
                                    {user.name}
                                </h2>
                                <p className="text-sm text-[#48A6A7]">
                                    {user.email}
                                </p>
                                <span className="inline-block mt-2 px-3 py-1 text-xs bg-[#F2EFE7] text-[#006A71] rounded-full">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4 border-[#F2EFE7] text-sm text-gray-500">
                            <p>
                                <span className="font-medium text-[#006A71]">
                                    Joined:
                                </span>{" "}
                                {user.updatedAt}
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <motion.button
                                onClick={() => router.push("/upload-modal")}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#48A6A7] to-[#006A71] hover:opacity-90 text-white px-5 py-2 rounded-md font-medium transition"
                            >
                                Upload Model
                            </motion.button>
                        </div>


                        <div className="mt-4 flex justify-end">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#48A6A7] to-[#006A71] hover:opacity-90 text-white px-5 py-2 rounded-md font-medium transition"
                            >
                                Edit Profile
                            </motion.button>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <motion.button
                                onClick={handleLogout}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#48A6A7] to-[#006A71] hover:opacity-90 text-white px-5 py-2 rounded-md font-medium transition"
                            >
                                logout
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
