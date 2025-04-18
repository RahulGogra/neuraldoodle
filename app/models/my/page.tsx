"use client";

import Navbar from "@/utils/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

type ModelJsonType = {
    layers: number;
    classes: string[];
    data: {
      [key: string]: unknown; // or make this more specific
    };
};

  

  export type ModelType = {
    _id: string;
    name: string;
    modelJson: ModelJsonType;
    isPublic: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
  
  

export default function ModelsPage() {
    const [models, setModels] = useState<ModelType[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            toast.error("User not logged in.");
            router.push("/auth");
            return;
        }

        const fetchModels = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_URL;
        
                const res = await fetch(`${apiUrl}/model/my`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    credentials: "include", // include cookies in request
                });
        
                const data = await res.json();
        
                if (res.ok) {
                    setModels(data);
                } else {
                    toast.error(data.error || "Failed to fetch models");
                }
            } catch (err) {
                toast.error("Server error");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        

        fetchModels();
    }, [router]);

    if (loading)
        return (
            <div className="text-center pt-20 bg-[#F2EFE7] h-screen w-screen text-3xl">
                Loading your models...
            </div>
        );

    return (
        <>
            <Navbar />
            <div className="bg-[#F2EFE7] min-h-screen pt-20 px-4">
                <motion.div
                    className="max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-[#006A71] mb-6 text-center">
                        Your All Uploaded Models
                    </h1>
                    {models.length === 0 ? (
                        <p className="text-center text-gray-600">
                            No models uploaded yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {models.map((model) => (
                                <motion.div
                                    key={model._id}
                                    className="bg-white border border-[#9ACBD0] rounded-xl shadow-md p-6"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h2 className="text-xl font-semibold text-[#006A71]">
                                        {model.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1 mb-2">
                                        {model.isPublic ? "Public" : "Private"}
                                    </p>
                                    <pre className="bg-[#F2EFE7] p-2 rounded-md text-xs overflow-x-auto">
                                        {JSON.stringify(model.modelJson, null, 2).slice(0, 300)}...
                                    </pre>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}
