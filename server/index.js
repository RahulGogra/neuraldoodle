import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import serverless from "serverless-http";

// Load env variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://neuraldoodle.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);

app.get("/", (req, res) => {
  res.send("Auth API is running");
});

const PORT = process.env.PORT || 5000;

// ✅ Only run `listen()` locally or when NOT on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ✅ Export for serverless deployment
export default serverless(app);
