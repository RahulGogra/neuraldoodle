import express from "express";
const router = express.Router();
import ModelObject from "../models/Model.js";

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


export default router;
