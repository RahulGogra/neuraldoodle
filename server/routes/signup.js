import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // ✅ You need this
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, role, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: "Email already in use. Please sign in instead.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            role,
            password: hashedPassword,
            provider: "credentials",
        });

        await newUser.save();

        // ✅ Generate token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User created successfully.",
            token, // ✅ Now defined
            user: {
                id: newUser._id,
                name: newUser.name,
                role: newUser.role,
                email: newUser.email,
                provider: newUser.provider,
                updatedAt: newUser.updatedAt,
            },
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
