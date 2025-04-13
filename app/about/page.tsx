"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/utils/navbar";

export default function About() {
    return (
        <>
            <Navbar />
            <div className="bg-[#F2EFE7] text-gray-800 mt-10">
                {/* 🎯 Hero Section */}
                <section className="flex flex-col items-center text-center py-20 px-6">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-[#006A71]"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        About Teachable Machine
                    </motion.h1>
                    <motion.p
                        className="mt-4 text-lg max-w-2xl text-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Empowering users to create AI models effortlessly with
                        real-time training. Built with cutting-edge technologies
                        to make Machine Learning accessible to all.
                    </motion.p>
                </section>

                {/* ⚡ Technology Stack */}
                <section className="py-20 bg-[#9ACBD0] text-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Technology Stack
                    </h2>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Next.js",
                                logo: "https://cdn.worldvectorlogo.com/logos/next-js.svg",
                            },
                            {
                                name: "TensorFlow.js",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
                            },
                            {
                                name: "Framer Motion",
                                logo: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg",
                            },
                            {
                                name: "Tailwind CSS",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
                            },
                            {
                                name: "TypeScript",
                                logo: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
                            },
                            {
                                name: "MongoDB",
                                logo: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
                            },
                            {
                                name: "Express",
                                logo: "https://cdn.worldvectorlogo.com/logos/express-109.svg",
                            },
                        ].map((tech, index) => (
                            <motion.div
                                key={index}
                                className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Image
                                    src={tech.logo}
                                    alt={tech.name}
                                    width={80}
                                    height={80}
                                />
                                <h3 className="text-lg font-semibold mt-4 text-[#006A71] ">
                                    {tech.name}
                                </h3>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 🚀 Our Mission */}
                <section className="py-20 text-center">
                    <h2 className="text-3xl font-bold text-[#48A6A7]">
                        Our Mission
                    </h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        We believe in making AI accessible to everyone, from
                        students to professionals. Our platform is built with
                        user-friendly tools that allow seamless AI model
                        creation with real-time learning capabilities.
                    </p>
                </section>

                {/* 👨‍💻 Meet the Team */}
                <section className="py-20 bg-[#48A6A7] text-center text-white">
                    <h2 className="text-3xl font-bold">Meet the Team</h2>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Rahul Gogra",
                                role: "Lead Developer",
                                img: "/rahul.jpg",
                            },
                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                className="p-6 bg-white rounded-lg shadow-lg text-gray-900 flex flex-col items-center"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Image
                                    src={member.img}
                                    alt={member.name}
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                                <h3 className="text-xl font-semibold mt-4">
                                    {member.name}
                                </h3>
                                <p className="text-[#006A71]">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
