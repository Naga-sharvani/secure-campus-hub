from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = YOLO("yolov8n.pt")
print("hey")

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read()))
    results = model(image)

    objects = []
    for box in results[0].boxes:
        cls = int(box.cls)
        objects.append(model.names[cls])

    return {"objects": objects}

port = int(os.environ.get("PORT", 8000))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)