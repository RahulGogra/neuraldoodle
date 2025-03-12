import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect("mongodb+srv://rahul:Rahul%401234@neuralspace.ydoj8.mongodb.net/")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
    res.send("Teachable Machine Backend");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
