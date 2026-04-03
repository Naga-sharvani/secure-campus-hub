from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

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