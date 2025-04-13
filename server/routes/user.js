import express from "express";
import verifyToken from "../middleware/auth.js"; // import middleware

const router = express.Router();

// Protected route
router.get("/profile", verifyToken, async (req, res) => {
    // req.user was set in the middleware
    res.json({ message: "User profile data", user: req.user });
});

export default router;
