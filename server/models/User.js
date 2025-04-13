import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
            default: "",
        },
        password: {
            type: String,
            // Only required for credentials-based users
            required: function () {
                return !this.provider;
            },
        },
        provider: {
            type: String,
            enum: ["credentials", "google", "github"],
            default: "credentials",
        },
        image: {
            type: String, // For storing profile image from OAuth providers
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
