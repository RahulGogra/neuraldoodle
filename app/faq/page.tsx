"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/utils/navbar";

const faqs = [
    {
        question: "What is Teachable Machine?",
        answer: "Teachable Machine is a web-based tool that lets you train machine learning models in your browser using images, sounds, or poses.",
    },
    {
        question: "Do I need coding experience to use it?",
        answer: "No! Teachable Machine is designed to be beginner-friendly. You can train models without writing any code.",
    },
    {
        question: "Is my data stored online?",
        answer: "No, unless you choose to save it. Training happens in your browser, and data stays on your device.",
    },
    {
        question: "Can I export my trained model?",
        answer: "Yes! You can export your model for TensorFlow.js, TensorFlow Lite, or other formats for further use.",
    },
    {
        question: "Is Teachable Machine free to use?",
        answer: "Yes, Teachable Machine is completely free and open-source.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Navbar />
            <section className="bg-[#F2EFE7] py-20 px-6 text-center h-screen">
                <h2 className="text-4xl font-bold text-[#006A71]">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
                    Got questions? We’ve got answers! Here are some common
                    questions about Teachable Machine.
                </p>

                <div className="mt-10 max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-5 rounded-lg shadow-md cursor-pointer"
                            onClick={() => toggleFAQ(index)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-[#006A71]">
                                    {faq.question}
                                </h3>
                                <motion.span
                                    animate={{
                                        rotate: openIndex === index ? 180 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="text-[#006A71] text-2xl font-bold"
                                >
                                    {openIndex === index ? "−" : "+"}
                                </motion.span>
                            </div>
                            {openIndex === index && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-600 mt-3 text-left"
                                >
                                    {faq.answer}
                                </motion.p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    );
}
