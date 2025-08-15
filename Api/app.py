from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
# from keras.layers import TFSMLayer
import numpy as np
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model('../Models/plant_village.keras')

# model = TFSMLayer('../plant_village_model_1', call_endpoint='serving_default') #For inference-only(Another way)

class_names = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((256, 256))  # Change size to match your model input
    img_array = np.array(img) / 255.0  # Normalize if needed
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
async def predict_disease(file: UploadFile = File(..., description="Upload an image file for disease prediction")):
    image = await file.read()
    processed_image = preprocess_image(image)
    prediction = model(processed_image)
    predicted_class_index = np.argmax(prediction, axis=1)
    confidence = np.max(prediction, axis=1)
    disease_name = class_names[int(predicted_class_index[0])]
    return {
        "predicted_class": int(predicted_class_index[0]),
        "disease_name": disease_name,
        # "confidence": float(confidence)
        "confidence": f"{float(confidence) * 100: .2f} %"
    }

