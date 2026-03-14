import axios from "axios";
import FormData from "form-data";

export const sendToYolo = async (buffer) => {
  const formData = new FormData();
  formData.append("file", buffer, "image.jpg");

  const res = await axios.post(
    "http://localhost:8000/detect",
    formData,
    { headers: formData.getHeaders() }
  );

  return res.data.objects.map(o => o.toLowerCase());
};