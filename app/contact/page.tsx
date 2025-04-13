"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/utils/navbar";
import toast from "react-hot-toast";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload

        setTimeout(() => {
            toast.success("Message sent successfully!", { duration: 3000 });
        }, 2000);
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <>
            <Navbar />
            <section className="bg-[#F2EFE7] min-h-screen flex flex-col items-center justify-center p-10 mt-10">
                {/* Header */}
                <motion.h2
                    className="text-4xl font-bold text-[#006A71] text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Get In Touch
                </motion.h2>
                <p className="text-gray-700 mt-2 text-center max-w-xl">
                    Have any questions or want to work together? Fill out the
                    form below or reach out via social media.
                </p>

                {/* Contact Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="mt-8 bg-white shadow-lg p-6 rounded-lg w-full max-w-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-4">
                        <label className="block text-gray-800 font-semibold">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-800 font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-800 font-semibold">
                            Message
                        </label>
                        <textarea
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                            required
                        ></textarea>
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full bg-[#006A71] text-white py-2 rounded hover:bg-[#48A6A7] transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Send Message
                    </motion.button>
                </motion.form>

                {/* Social Media */}
                <div className="mt-8 flex space-x-6">
                    <motion.a
                        href="https://x.com/Rahulgogra"
                        target="_blank"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn.worldvectorlogo.com/logos/x-2.svg"
                            alt="X"
                            width={40}
                            height={40}
                        />
                    </motion.a>
                    <motion.a
                        href="https://www.linkedin.com/in/rahul-gogra-ba4135203/"
                        target="_blank"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn-icons-png.flaticon.com/512/733/733561.png"
                            alt="LinkedIn"
                            width={40}
                            height={40}
                        />
                    </motion.a>
                    <motion.a
                        href="https://github.com/RahulGogra"
                        target="_blank"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                            alt="GitHub"
                            width={40}
                            height={40}
                        />
                    </motion.a>
                </div>
            </section>
        </>
    );
}
