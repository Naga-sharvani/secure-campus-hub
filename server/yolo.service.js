import axios from "axios";
import FormData from "form-data";

// Function to send image buffer to YOLO detection service
export const sendToYolo = async (buffer) => {
  try {
    const formData = new FormData();
    //Attach image buffer as file named "image.png" (YOLO expects a file input)
    formData.append("file", buffer, "image.jpg");

    const res = await axios.post(
      "https://secure-campus-hub.onrender.com/detect",
      formData,
      { headers: formData.getHeaders() }
    );

    // Convert detected object names to lowercase and return them for the next processing step
    return res.data.objects.map(o => o.toLowerCase());

  } catch (err) {
    console.error("YOLO request failed:", err.message);
    throw err;
  }
};