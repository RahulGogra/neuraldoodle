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

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://neuraldoodle.vercel.app",
];

// CORS middleware - place this BEFORE your routes
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request origin:", origin);
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Parsing middleware
app.use(express.json());
app.use(cookieParser());

// Routes - defined after CORS middleware
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/api", userRoutes); // Protected routes

// Default route
app.get("/", (req, res) => {
  res.send("Auth API is running");
});

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS not allowed for this origin"
    });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));