import express from "express";
import cors from "cors";
import { sendToYolo } from "./yolo.service.js";
import { base64ToBuffer } from "./utils.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/match", async (req, res) => {
  console.log("MATCH ROUTE HIT");
  try {
    const { text, image } = req.body;
    console.log("Received request:", text);
    console.log("Image exists:", !!image);
    const buffer = base64ToBuffer(image);
    const objects = await sendToYolo(buffer);
    console.log("YOLO returned:", objects);
    const match = objects.includes(text.toLowerCase());
    res.json({ match, detected: objects });
    
  } catch (err) {
  console.error("FULL ERROR:", err.response?.data || err.message);
  res.status(500).json({ error: "Detection failed" });
}
});

app.listen(5000, () => console.log("Server running"));