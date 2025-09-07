from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

# -------------------- App --------------------
app = FastAPI()

# -------------------- CORS --------------------
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- MongoDB --------------------
client = MongoClient("mongodb://localhost:27017/")  # Replace with MongoDB Atlas URI if using cloud
db = client["notes_app"]
users_collection = db["users"]
notes_collection = db["notes"]

# -------------------- Security --------------------
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# -------------------- Models --------------------
class User(BaseModel):
    username: str
    password: str

class Note(BaseModel):
    title: str
    content: str

# -------------------- Helper Functions --------------------
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(username: str):
    return users_collection.find_one({"username": username})

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if user and verify_password(password, user["password"]):
        return user
    return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user(username)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# -------------------- Routes --------------------
@app.get("/")
def home():
    return {"message": "Notes App Backend is Running with MongoDB!"}

@app.post("/register")
def register(user: User):
    if get_user(user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_pw = get_password_hash(user.password)
    users_collection.insert_one({"username": user.username, "password": hashed_pw})
    return {"msg": "User registered successfully"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": form_data.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/notes")
def create_note(note: Note, current_user: dict = Depends(get_current_user)):
    note_data = {
        "user": current_user["username"],
        "title": note.title,
        "content": note.content
    }
    notes_collection.insert_one(note_data)
    return {"msg": "Note created successfully"}

@app.get("/notes")
def get_notes(current_user: dict = Depends(get_current_user)):
    user_notes = list(notes_collection.find({"user": current_user["username"]}, {"_id": 0}))
    return {"notes": user_notes}
