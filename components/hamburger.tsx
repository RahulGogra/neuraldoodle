"use client";
import { motion } from "framer-motion";
import React from "react";

interface MenuButtonProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
  isOpen, 
  onClick, 
  className = "" 
}) => {
  // Define bar variants for animation
  const topBarVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 8 },
  };

  const middleBarVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };

  const bottomBarVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -8 },
  };

  return (
    <div 
      className={`flex flex-col justify-center items-center ${className}`}
      onClick={onClick}
      role="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      tabIndex={0}
    >
      <div className="relative w-8 h-6">
        {/* Top bar */}
        <motion.div
          className="absolute top-0 w-full h-1 bg-current rounded-full"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={topBarVariants}
          transition={{ duration: 0.3 }}
        />
        
        {/* Middle bar */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-current rounded-full"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={middleBarVariants}
          transition={{ duration: 0.3 }}
        />
        
        {/* Bottom bar */}
        <motion.div
          className="absolute bottom-0 w-full h-1 bg-current rounded-full"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={bottomBarVariants}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default MenuButton;