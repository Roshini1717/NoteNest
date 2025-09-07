# 📝 Notes App

A full-stack **Online Notes Application** built with:

- ⚡ **FastAPI** (Backend)
- ⚛️ **React.js** (Frontend)
- 🍃 **MongoDB** (Database)

This app allows users to **register, login, and create/manage notes** securely.

---

## 🚀 Features
- User authentication (Register & Login)
- JWT-based authorization
- Add personal notes
- View notes only for logged-in users
- MongoDB database integration
- Fast and responsive frontend

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Axios, CSS
- **Backend**: FastAPI, Uvicorn, Pydantic
- **Database**: MongoDB
- **Authentication**: OAuth2PasswordBearer (JWT)

---

## 📂 Project Structure


notes-app/
│
├── backend/ # FastAPI backend
│ ├── main.py # Main backend app
│ ├── requirements.txt # Python dependencies
│ └── venv/ # Virtual environment (ignored in git)
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # Auth, Notes components
│ │ ├── App.js
│ │ └── index.js
│ └── package.json # Frontend dependencies
│
└── README.md




---



### Backend Setup


cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
source venv/bin/activate # On Linux/Mac

pip install -r requirements.txt
uvicorn main:app --reload


Backend will start at 👉 http://127.0.0.1:8000


### Frontend Setup

cd frontend
npm install
npm start


Frontend will start at 👉 http://localhost:3000


🌐 API Endpoints

POST /register → Register new user

POST /login → Login user & get token

POST /notes → Create a note (requires token)

GET /notes → Get user’s notes (requires token)