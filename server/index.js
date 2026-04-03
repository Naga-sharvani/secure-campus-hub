import express from "express";
import cors from "cors";
import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";

const app = express();

app.use(cors());

const upload = multer();

app.post("/match", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const formData = new FormData();

    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch("http://127.0.0.1:8000/detect", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await response.json();

    res.json(data);

  } catch (err) {
    console.error("Forwarding error:", err);
    res.status(500).json({ error: "YOLO request failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});