"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScrollProgressCircleProps {
    size?: number; // Diameter of the circle
    strokeWidth?: number; // Thickness of the progress stroke
    color?: string; // Progress color
    bgColor?: string; // Background stroke color
}

export default function ScrollProgressCircle({
    size = 60,
    strokeWidth = 6,
    color = "#6ef3f5",
    bgColor = "#D9D9D9",
}: ScrollProgressCircleProps) {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", updateScrollProgress);
        return () => window.removeEventListener("scroll", updateScrollProgress);
    }, []);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (scrollProgress / 100) * circumference;

    // 🔹 Calculate correct angle (Start from top -90°)
    const angle = (-90 + (scrollProgress / 100) * 360) * (Math.PI / 180);

    // 🔹 Calculate position of the black dot (Indicator)
    const centerX = size / 2;
    const centerY = size / 2;
    const indicatorX = centerX + radius * Math.cos(angle);
    const indicatorY = centerY + radius * Math.sin(angle);

    return (
        <motion.div
            className="fixed bottom-6 left-6 flex items-center justify-center drop-shadow-xl z-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <svg width={size} height={size}>
                {/* Background Circle */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Progress Circle (Rotated -90° to start from top) */}
                <motion.circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${centerX} ${centerY})`} // 🔹 Rotate to start from top
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.05, ease: "linear" }}
                />
                {/* 🔴 Perfectly Moving Black Indicator */}
                <motion.circle
                    cx={indicatorX}
                    cy={indicatorY}
                    r={3} // Size of the indicator dot
                    fill="black"
                    transition={{ duration: 0.2, ease: "linear" }}
                />
            </svg>
        </motion.div>
    );
}
