"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ScrollProgressCircle from "./scrollProgress";
import MenuButton from "@/components/hamburger";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState({
        email: "",
        id: "",
        name: "",
        provider: "",
    });

    useEffect(() => {
        try {
            const data = localStorage.getItem("user");
            if (data && data !== "undefined") {
                setUser(JSON.parse(data));
            }
        } catch (err) {
            console.error("Failed to load user:", err);
        }
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ's", href: "/faq" },
    ];

    return (
        <>
            <ScrollProgressCircle />
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#F2EFE7] shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/">
                        <h1 className="text-3xl font-bold text-[#006A71]">
                            Neural Doodle
                        </h1>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="hidden md:flex space-x-8 text-[#006A71] text-xl font-semibold">
                        {navLinks.map(({ name, href }) => (
                            <li key={name}>
                                <Link
                                    href={href}
                                    className="hover:text-[#48A6A7] transition-colors mx-1.3"
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link
                                href={user.name ? "/profile" : "/auth"}
                                className="hover:text-[#48A6A7] transition-colors"
                            >
                                {user.name || "Login/Register"}
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <div
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden"
                    >
                        <MenuButton
                            isOpen={menuOpen}
                            className="text-[#006A71] w-10 h-10 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {menuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                className="fixed inset-0 bg-black/30 z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMenuOpen(false)}
                            />

                            {/* Sliding Menu Panel */}
                            <motion.div
                                className="fixed top-0 right-0 h-full w-64 bg-[#F2EFE7] z-50 shadow-lg px-6 py-8 flex flex-col space-y-6 text-[#006A71] font-semibold text-lg"
                                initial={{ x: 300 }}
                                animate={{ x: 0 }}
                                exit={{ x: 300 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            >
                                {/* Close Button inside menu */}
                                <div className="absolute top-4 right-4">
                                    <MenuButton
                                        isOpen={menuOpen}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-[#006A71] w-10 h-10"
                                    />
                                </div>

                                <div className="mt-12 flex flex-col space-y-6">
                                    {navLinks.map(({ name, href }) => (
                                        <Link
                                            key={name}
                                            href={href}
                                            onClick={() => setMenuOpen(false)}
                                            className="hover:text-[#48A6A7] transition-colors"
                                        >
                                            {name}
                                        </Link>
                                    ))}
                                    <Link
                                        href={user.name ? "/profile" : "/auth"}
                                        onClick={() => setMenuOpen(false)}
                                        className="hover:text-[#48A6A7] transition-colors"
                                    >
                                        {user.name || "Login/Register"}
                                    </Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Navbar;
