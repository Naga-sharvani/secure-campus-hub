import express from "express";
import cors from "cors";
import { sendToYolo } from "./yolo.service.js";
// Middleware used to handle file uploads (images here)
import multer from "multer";

const app = express();
app.use(cors({
  origin: "https://secure-campus-hub.vercel.app"
}));
const upload = multer();

//receives image from frontend, forwards it to YOLO, and returns the detected objects back to frontend
app.post("/match", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    //receive data from YOLO and returns detected object labels
    const objects = await sendToYolo(req.file.buffer);
    res.json({ objects });

  } catch (err) {
    console.error("Forwarding error:", err);
    res.status(500).json({ error: "YOLO request failed" });
  }
});

// Start Express server on port 5000
app.listen(5000, () => {
  console.log("Server running");
});