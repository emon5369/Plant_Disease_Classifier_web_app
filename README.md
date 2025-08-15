# 🌿 Plant Disease Classifier – Web App

A full-stack web application built with **React** (frontend) and **FastAPI** (backend) that predicts plant leaf diseases from uploaded images.
The app displays both the **predicted class** and the **confidence score**, making it easy for farmers, researchers, and hobbyists to detect plant health issues quickly.

---

## 🚀 Features

* 📷 **Image Upload** – Upload a plant leaf photo directly from your device.
* 🔍 **Real-time Prediction** – Model predicts the class and returns a confidence score.
* ⚡ **FastAPI Backend** – Handles image processing and model inference efficiently.
* 🎨 **React Frontend** – User-friendly, responsive interface for smooth interaction.

---

## 🛠️ Tech Stack

**Frontend**

* React
* Tailwind CSS

**Backend**

* FastAPI
* TensorFlow/Keras (for loading trained model)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/plant-disease-classifier-web.git
cd plant_disease_classifier_web_app
```

### 2️⃣ Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run on **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on **[http://localhost:5173](http://localhost:5173)**

---

## 📸 Usage

1. Open the web app in your browser.
2. Select the **Choose File** field and choose a leaf image.
4. Click the **Classify** button for the prediction — the app will display:

   * **Predicted Class** (e.g., Healthy)
   * **Confidence Score** (e.g., 92.3%)

---

## 🔗 Related Repositories

* 🧠 **Model Training & Dataset** → [Plant Disease Classifier (Training Repo)](https://github.com/emon5369/Plant_Disease_Classifier.git)
