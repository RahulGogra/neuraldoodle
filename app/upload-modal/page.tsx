"use client";

import Navbar from "@/utils/navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [name, setName] = useState("");
    const [modelJson, setModelJson] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
            setLoading(false);
        } else {
            toast.error("User not logged in.");
            router.push("/auth");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Auth token missing.");
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_URL;
        try {
            const res = await fetch(`${apiUrl}/model/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, modelJson, isPublic, user }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Model uploaded successfully!");
                setName("");
                setModelJson("");
                setIsPublic(false);
            } else {
                toast.error(data.error || "Upload failed.");
            }
        } catch (error) {
            toast.error("Server error.");
        }
    };

    if (loading)
        return (
            <div className="text-center pt-20 bg-[#F2EFE7] h-screen w-screen text-3xl justify-center">
                Checking auth...
            </div>
        );

    return (
        <>
            <Navbar />
            <div className="bg-[#F2EFE7] min-h-screen pt-20">
                <motion.div
                    className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border-2 border-[#9ACBD0] p-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className="text-2xl font-bold text-[#006A71] mb-4">
                        Upload Your Model
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[#006A71] font-medium">
                                Model Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border border-[#9ACBD0] rounded-md outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[#006A71] font-medium">
                                Model JSON
                            </label>
                            <textarea
                                value={modelJson}
                                onChange={(e) => setModelJson(e.target.value)}
                                required
                                rows={6}
                                className="w-full mt-1 px-4 py-2 border border-[#9ACBD0] rounded-md outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={() => setIsPublic(!isPublic)}
                                className="accent-[#48A6A7]"
                            />
                            <span className="text-[#006A71]">
                                Make model public
                            </span>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-gradient-to-r from-[#48A6A7] to-[#006A71] hover:opacity-90 text-white px-6 py-2 rounded-md font-medium transition"
                        >
                            Upload Model
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </>
    );
}
