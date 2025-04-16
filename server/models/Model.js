import mongoose from "mongoose";

const ModelObjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    modelJson: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // <-- assuming your user model is named 'User'
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ModelObject || mongoose.model('ModelObject', ModelObjectSchema);
