<h1><b> 🛡️ Secure Campus Hub </b> </h1>

Secure Campus Hub is an adaptive Multi-Factor Authentication (MFA) system that bridges traditional login security with AI-driven verification using computer vision.

Unlike static 2FA systems, Secure Campus Hub introduces a context-aware authentication flow, where the verification challenge is dynamically selected during logout and enforced during the next login session.

This creates a Logout-to-Login Handshake, improving resistance against automated attacks and unauthorized access.

🚀 Key Innovation: Adaptive Verification </hr>

Traditional authentication systems use fixed verification steps.

Secure Campus Hub introduces a dynamic second factor chosen during logout.

🔐 Logout-to-Login Handshake </hr>

During logout:

The admin selects the next login verification method

The system stores the selected challenge

The next login requires completion of that challenge


This creates:
    <li>Unpredictable authentication flow</li>
    <li> Reduced automation attack success</li>
    <li> Stronger admin-level protection</li>


🔑 Authentication Layers: </hr>

Secure Campus Hub uses a two-level adaptive authentication pipeline

Level 1: Primary Authentication

Standard secure password login

Level 2: Adaptive Verification Challenge

One of the following methods is required:

📘 Knowledge-Based Verification </hr>

Custom security questions such as:

"What is your favorite book?"

🤖 Vision-Based Verification (AI Powered) </hr>

Upload an image containing a specified object

Example:

"Upload an image containing a cake to gain entry"

The image is validated using YOLOv8 object detection

🏗️ System Architecture </hr>

Secure Campus Hub follows a microservices-style architecture to isolate machine learning inference from core authentication logic.

React Frontend
      ↓
Express API Gateway
      ↓
FastAPI ML Inference Service (YOLOv8)

This ensures:

✔ scalability

✔ modular deployment

✔ maintainability

✔ production-ready service separation

🛠️ Tech Stack: </hr>

**Frontend**	React + TypeScript	

**Backend**	Node.js + Express	API 

**ML Engine**	FastAPI + YOLOv8	

**Communication**	REST APIs

🔄 Authentication Workflow </hr>

Login Flow

Admin enters password

System retrieves stored verification method

Admin completes selected challenge:

Security Question OR

YOLO Image Verification

Access granted

Logout Flow

Admin selects next verification method

Selection stored securely

Method enforced during next login

🛠️ Setup Instructions: </hr>

1️⃣ Clone Repository

git clone https://github.com/yourusername/secure-campus-hub.git

cd secure-campus-hub

2️⃣ Start ML Service

cd ml-service

uvicorn yolo_api:app --reload

Runs on:

http://localhost:8000

3️⃣ Start Backend Server

cd server

node index.js

Runs on:

http://localhost:5000

4️⃣ Start Frontend

npm install

npm run dev

Runs on:

http://localhost:8080

🧪 Test Image Authentication: </hr>

Login as admin (The username should end with @admin) and the password is **pass123**

Logout

Select Image Verification

Enter object label (example: banana)

Login again

Upload banana image

Access granted

🔒 Security Design Highlights: </hr>

Login pages and access based on username endpoints

Dynamic verification method selection

Separation of ML inference service

Backend proxy between UI and detection engine

Prevents direct ML endpoint exposure

Extensible MFA architecture


📈Planned upgrades: </hr>

Database-backed verification storage

Attempt logging & audit trails

Role-based verification policies

Multi-object verification support

Face recognition authentication

JWT session management

Deployment-ready Docker setup

🎯Designed for: </hr>

Campus admin portals

Secure internal dashboards

Research authentication prototypes

Multi-factor authentication demonstrations

ML-integrated security workflows

🛡️ Enter the Secure Campus Hub Portal: </hr>
https://secure-campus-hub.vercel.app/
