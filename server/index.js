import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";

// Load env variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();
const URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
    cors({
        origin: URL, // frontend URL
        credentials: true, // allow cookies or auth headers
    })
);
app.use(express.json()); // for parsing JSON requests
app.use(cookieParser());

app.use("/api", userRoutes); // Protected routes
// Routes
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);

// Default route
app.get("/", (req, res) => {
    res.send("Auth API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
