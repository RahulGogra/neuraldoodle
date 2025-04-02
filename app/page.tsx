"use client";
import Navbar from "@/components/navbar";
import type { NextPage } from "next";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Home: NextPage = () => {
    const text =
        "Train your own AI model in your browser with no coding required.";
    const techStack = [
        {
            name: "Next.js",
            logo: "https://cdn.worldvectorlogo.com/logos/next-js.svg",
            desc: "React Framework",
            bg: "#F2EFE7",
            text: "#006A71",
        },
        {
            name: "TypeScript",
            logo: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
            desc: "Typed JavaScript",
            bg: "#9ACBD0",
            text: "#006A71",
        },
        {
            name: "TensorFlow.js",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
            desc: "Machine Learning",
            bg: "#48A6A7",
            text: "#F2EFE7",
        },
        {
            name: "Tailwind CSS",
            logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
            desc: "Utility-First CSS",
            bg: "#006A71",
            text: "#F2EFE7",
        },
        {
            name: "Framer Motion",
            logo: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg",
            desc: "Smooth Animations",
            bg: "#F2EFE7",
            text: "#006A71",
        },
        {
            name: "MongoDB",
            logo: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
            desc: "NoSQL Database",
            bg: "#9ACBD0",
            text: "#006A71",
        },
    ];
    const benefits = [
        {
            title: "No Coding Required",
            desc: "Train machine learning models without writing a single line of code.",
            icon: "https://cdn-icons-png.flaticon.com/512/868/868786.png",
            bg: "#F2EFE7",
            text: "#006A71",
        },
        {
            title: "Runs in Your Browser",
            desc: "Everything happens locally in your browser – no cloud processing required.",
            icon: "https://cdn-icons-png.flaticon.com/512/686/686089.png",
            bg: "#9ACBD0",
            text: "#006A71",
        },
        {
            title: "Works with Images, Sound, & Poses",
            desc: "Use images, sound, or body movements to train your model.",
            icon: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
            bg: "#48A6A7",
            text: "#F2EFE7",
        },
        {
            title: "Export & Use Anywhere",
            desc: "Deploy your trained models in websites, apps, or creative projects.",
            icon: "https://cdn-icons-png.flaticon.com/512/3159/3159020.png",
            bg: "#006A71",
            text: "#F2EFE7",
        },
    ];

    return (
        <>
            <Navbar />
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-screen bg-[#F2EFE7] text-gray-900 text-center p-8">
                <h1 className="text-9xl font-bold text-[#006A71]">
                    Teachable Machine
                </h1>
                <p className="mt-4 text-4xl max-w-xl text-[#48A6A7] flex flex-wrap justify-center">
                    {text.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            whileHover={{
                                y: -10,
                                rotate: Math.random() * 10 - 5,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 10,
                            }}
                            className="inline-block cursor-pointer"
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </p>
                <div className="mt-6 flex gap-4">
                    <motion.button
                        whileHover={{
                            scale: 1.1,
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="px-6 py-3 bg-[#48A6A7] text-white font-semibold rounded-lg shadow-lg hover:bg-[#006A71] transition cursor-pointer"
                    >
                        Start Training
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-6 py-3 bg-[#9ACBD0] text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-[#48A6A7] transition cursor-pointer"
                    >
                        Make Predictions
                    </motion.button>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-[#9ACBD0] text-center">
                <h2 className="text-3xl font-bold text-gray-800">
                    How It Works
                </h2>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            title: "1. Upload Data",
                            desc: "Use your webcam or upload images to create training data.",
                            color: "#006A71",
                            img: "/upload.png",
                        },
                        {
                            title: "2. Train Model",
                            desc: "Train your AI model in real-time, directly in the browser.",
                            color: "#48A6A7",
                            img: "/train.png",
                        },
                        {
                            title: "3. Predict & Export",
                            desc: "Test your model and download it for future use.",
                            color: "#9ACBD0",
                            img: "/predict.png",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-white rounded-lg shadow"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: false, amount: 0.2 }}
                        >
                            <div className="overflow-hidden rounded-lg">
                                <Image
                                    src={item.img}
                                    width={300}
                                    height={200}
                                    alt={item.title}
                                    className="transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                            <h3
                                className={`text-xl font-semibold mt-4`}
                                style={{ color: item.color }}
                            >
                                {item.title}
                            </h3>
                            <p className="mt-2 text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* What Can You Use to Teach It? Section */}
            <section className="py-20 bg-[#48A6A7] text-center text-white overflow-hidden">
                {/* Title Animation */}
                <motion.h2
                    className="text-4xl font-bold"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    What Can I Use to Teach It?
                </motion.h2>

                <motion.p
                    className="mt-4 text-lg max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    Teachable Machine is flexible – use files or capture
                    examples live. You can even choose to use it entirely
                    on-device, without any webcam or microphone data leaving
                    your computer.
                </motion.p>

                {/* Training Options */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {[
                        {
                            title: "Sample Images",
                            desc: "Train your model using sample images or datasets.",
                            img: "/sample.png",
                            color: "#006A71",
                        },
                        {
                            title: "Live Images",
                            desc: "Capture images using your webcam to train in real-time.",
                            img: "/live.png",
                            color: "#9ACBD0",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-white rounded-lg shadow-lg text-gray-900 relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: false, amount: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Background Accent */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    background: item.color,
                                    borderRadius: "inherit",
                                }}
                            />

                            {/* Image */}
                            <div className="overflow-hidden rounded-lg">
                                <Image
                                    src={item.img}
                                    width={300}
                                    height={200}
                                    alt={item.title}
                                    className="transition-transform duration-300 hover:scale-110 mx-auto"
                                />
                            </div>

                            {/* Title & Description */}
                            <h3
                                className="text-xl font-semibold mt-4"
                                style={{ color: item.color }}
                            >
                                {item.title}
                            </h3>
                            <p className="mt-2">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-[#F2EFE7] text-center overflow-hidden">
                {/* Section Title */}
                <motion.h2
                    className="text-4xl font-bold text-[#006A71]"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    The Technology Behind It 🚀
                </motion.h2>

                <motion.p
                    className="mt-4 text-lg text-[#006A71] max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    Built with cutting-edge technologies to provide real-time AI
                    training and predictions directly in your browser.
                </motion.p>

                {/* Tech Grid */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {techStack.map((tech, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-lg shadow-lg flex flex-col items-center"
                            style={{
                                backgroundColor: tech.bg,
                                color: tech.text,
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: false, amount: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Logo */}
                            <Image
                                src={tech.logo}
                                width={80}
                                height={80}
                                alt={tech.name}
                                className="transition-transform duration-300 hover:scale-110"
                            />
                            {/* Tech Name */}
                            <h3 className="text-xl font-semibold mt-4">
                                {tech.name}
                            </h3>
                            {/* Description */}
                            <p className="mt-2 text-sm opacity-90">
                                {tech.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-[#48A6A7] text-center text-white">
                {/* Section Title */}
                <motion.h2
                    className="text-4xl font-bold"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    Why Use Teachable Machine?
                </motion.h2>

                <motion.p
                    className="mt-4 text-lg max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    Teachable Machine makes AI accessible to everyone – whether
                    you&apos; re an educator, student, or creative. Build,
                    train, and deploy models effortlessly.
                </motion.p>

                {/* Benefits Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-lg shadow-lg flex flex-col items-center"
                            style={{
                                backgroundColor: benefit.bg,
                                color: benefit.text,
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: false, amount: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Icon */}
                            <Image
                                src={benefit.icon}
                                width={70}
                                height={70}
                                alt={benefit.title}
                                className="transition-transform duration-300 hover:scale-110"
                            />
                            {/* Title */}
                            <h3 className="text-xl font-semibold mt-4">
                                {benefit.title}
                            </h3>
                            {/* Description */}
                            <p className="mt-2 text-sm opacity-90">
                                {benefit.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer className="bg-[#006A71] text-white py-10">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                        {/* 🚀 Brand Info */}
                        <div>
                            <h2 className="text-2xl font-bold">
                                Teachable Machine
                            </h2>
                            <p className="mt-2 text-gray-300">
                                AI-powered training made simple & accessible.
                            </p>
                        </div>

                        {/* 🔗 Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold">
                                Quick Links
                            </h3>
                            <ul className="mt-3 space-y-2">
                                <li>
                                    <a
                                        href="/about"
                                        className="hover:text-[#9ACBD0] transition"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/features"
                                        className="hover:text-[#9ACBD0] transition"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/learn"
                                        className="hover:text-[#9ACBD0] transition"
                                    >
                                        Learn
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/contact"
                                        className="hover:text-[#9ACBD0] transition"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* 🌎 Social Links */}
                        <div>
                            <h3 className="text-lg font-semibold">Follow Us</h3>
                            <div className="flex justify-center md:justify-start space-x-4 mt-3">
                                <a
                                    href="https://facebook.com"
                                    className="hover:text-[#9ACBD0] transition"
                                >
                                    <FaFacebook size={24} />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    className="hover:text-[#9ACBD0] transition"
                                >
                                    <FaTwitter size={24} />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    className="hover:text-[#9ACBD0] transition"
                                >
                                    <FaLinkedin size={24} />
                                </a>
                                <a
                                    href="https://github.com"
                                    className="hover:text-[#9ACBD0] transition"
                                >
                                    <FaGithub size={24} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 📌 Bottom Bar */}
                    <div className="text-center mt-10 border-t border-[#48A6A7] pt-4 text-gray-300">
                        <p>
                            © {new Date().getFullYear()} Teachable Machine. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Home;
