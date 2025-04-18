import express from "express";
const router = express.Router();
import ModelObject from "../models/Model.js";
import verifyToken from "../middleware/auth.js";

// POST /api/model/upload
router.post('/upload', async (req, res) => {
  try {
    const { name, modelJson, isPublic, user } = req.body;

    if (!name || !modelJson) {
      return res.status(400).json({ error: 'Name and modelJson are required.' });
    }

    const newModel = new ModelObject({
      name,
      modelJson,
      isPublic: isPublic || false,
      createdBy: user.id,
    });

    await newModel.save();

    res.status(201).json({ message: 'Model uploaded successfully', model: newModel });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/all", async (req, res) => {
  try {
    const models = await ModelObject.find({ isPublic: true });

    res.status(200).json(models);
  } catch (err) {
    console.error("Error fetching models:", err);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

router.get("/my", verifyToken, async (req, res) => {
  try {
    console.log(req.user.id);
    const models = await ModelObject.find({ createdBy: req.user.id });

    res.status(200).json(models);

  } catch (err) {
    console.error("Error fetching models:", err);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});


export default router;
