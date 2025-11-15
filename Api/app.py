from fastapi import FastAPI, File, UploadFile, HTTPException
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
    # Validate image size (max 10MB)
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size exceeds 10MB limit")
    
    img = Image.open(io.BytesIO(image_bytes))
    
    # Validate image dimensions (max 4096x4096)
    if img.width > 4096 or img.height > 4096:
        raise HTTPException(status_code=400, detail="Image dimensions too large (max 4096x4096)")
    
    # Convert to RGB if needed and resize in one step
    img = img.convert("RGB").resize((256, 256), Image.LANCZOS)
    
    # Convert to normalized numpy array efficiently
    img_array = np.asarray(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
async def predict_disease(file: UploadFile = File(..., description="Upload an image file for disease prediction")):
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image = await file.read()
    processed_image = preprocess_image(image)
    
    # Use model.predict() instead of model() for better performance
    prediction = model.predict(processed_image, verbose=0)
    
    predicted_class_index = np.argmax(prediction, axis=1)[0]
    confidence = np.max(prediction, axis=1)[0]
    disease_name = class_names[predicted_class_index]
    
    return {
        "predicted_class": int(predicted_class_index),
        "disease_name": disease_name,
        "confidence": f"{float(confidence) * 100: .2f} %"
    }

