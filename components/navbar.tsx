"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ScrollProgressCircle from "./scrollProgress";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <ScrollProgressCircle />
            <nav className="fixed top-0 left-0 w-full bg-[#F2EFE7] shadow-md z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-[#006A71]">
                            Neural Doodle
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6 text-[#006A71] font-semibold">
                        <li>
                            <Link
                                href="/"
                                className="hover:text-[#48A6A7] transition"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/train"
                                className="hover:text-[#48A6A7] transition"
                            >
                                Train
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="hover:text-[#48A6A7] transition"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className="hover:text-[#48A6A7] transition"
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/faq"
                                className="hover:text-[#48A6A7] transition"
                            >
                                FAQ&apos;s
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-[#006A71] cursor-pointer w-10 h-10 flex items-center justify-center relative"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <motion.svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Top Line */}
                            <motion.line
                                x1="3"
                                y1="7"
                                x2="21"
                                y2="7"
                                stroke="#006A71"
                                strokeWidth="2"
                                strokeLinecap="round"
                                animate={{
                                    y1: menuOpen ? 15 : 7,
                                    y2: menuOpen ? 15 : 7,
                                    rotate: menuOpen ? 45 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            {/* Middle Line */}
                            <motion.line
                                x1="3"
                                y1="12"
                                x2="21"
                                y2="12"
                                stroke="#006A71"
                                strokeWidth="2"
                                strokeLinecap="round"
                                animate={{
                                    opacity: menuOpen ? 0 : 1,
                                    x1: menuOpen ? 12 : 3,
                                    x2: menuOpen ? 12 : 21,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            {/* Bottom Line */}
                            <motion.line
                                x1="3"
                                y1="17"
                                x2="21"
                                y2="17"
                                stroke="#006A71"
                                strokeWidth="2"
                                strokeLinecap="round"
                                animate={{
                                    y1: menuOpen ? 12 : 17,
                                    y2: menuOpen ? 12 : 17,
                                    rotate: menuOpen ? -45 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: "0%", opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="md:hidden bg-[#9ACBD0] absolute top-16 left-0 w-full py-4 shadow-lg rounded-lg"
                        >
                            <ul className="flex flex-col space-y-4 items-center text-[#006A71] font-semibold">
                                {["Home", "Train", "Predict", "About"].map(
                                    (item, index) => (
                                        <motion.li
                                            key={item}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 20, opacity: 0 }}
                                            transition={{
                                                duration: 0.2,
                                                delay: index * 0.1,
                                            }}
                                        >
                                            <Link
                                                href={`/${item.toLowerCase()}`}
                                                className="hover:text-[#48A6A7] transition"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                            >
                                                {item}
                                            </Link>
                                        </motion.li>
                                    )
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Navbar;
