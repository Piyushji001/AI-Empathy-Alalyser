# FastAPI application for AI Empathy & Mentoring Platform
# This API includes real-time AI sentiment analysis and CORS support for React frontend.
#    uvicorn main:app --reload

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware # Import CORS Middleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import motor.motor_asyncio
from bson import ObjectId
from passlib.context import CryptContext
from pydantic_core import core_schema
from transformers import pipeline

# --- Environment Variables ---
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# --- AI Model Loading ---
print("Loading sentiment analysis model...")
try:
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading sentiment analysis model: {e}")
    sentiment_pipeline = None

# --- Security (Password Hashing) ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Database Connection ---
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.empathy_platform
user_collection = db.get_collection("users")
interaction_collection = db.get_collection("interactions")

# --- FastAPI App Initialization ---
app = FastAPI(
    title="AI Empathy & Mentoring Platform API",
    description="API with real-time AI sentiment analysis and CORS enabled.",
    version="0.3.1",
)

# --- CORS Middleware Configuration ---
# This allows your React app (running on localhost:3000) to communicate with the backend.
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)


# --- Helper for MongoDB ObjectId (Pydantic v2 compatible) ---
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema(
                [
                    core_schema.is_instance_schema(ObjectId),
                    core_schema.chain_schema(
                        [
                            core_schema.str_schema(),
                            core_schema.no_info_plain_validator_function(cls.validate),
                        ]
                    ),
                ]
            ),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

# --- Pydantic Models ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    class Config:
        arbitrary_types_allowed = True

class InteractionBase(BaseModel):
    studentName: str
    transcript: List[Dict[str, str]] = Field(..., example=[{"speaker": "Teacher", "text": "How are you?"}, {"speaker": "Student", "text": "I am fine."}])

class InteractionCreate(InteractionBase):
    pass

class InteractionInDB(InteractionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    class Config:
        arbitrary_types_allowed = True

class AnalysisResult(BaseModel):
    interactionId: str
    overallEmpathyScore: float
    sentiment: Dict[str, float]
    feedback: List[str]

# --- Utility Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- API Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "Welcome to the AI Empathy Platform API! Now with AI Analysis."}

@app.post("/register/", response_model=UserBase, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    existing_user = await user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    user_dict = {"username": user.username, "hashed_password": hashed_password}
    await user_collection.insert_one(user_dict)
    return user_dict

@app.post("/interactions/", response_model=InteractionInDB, status_code=status.HTTP_201_CREATED)
async def save_interaction(interaction: InteractionCreate):
    interaction_dict = interaction.dict()
    result = await interaction_collection.insert_one(interaction_dict)
    created_interaction = await interaction_collection.find_one({"_id": result.inserted_id})
    return created_interaction

@app.get("/interactions/", response_model=List[InteractionInDB])
async def get_all_interactions():
    interactions = await interaction_collection.find().to_list(100)
    return interactions

@app.post("/analyze/{interaction_id}", response_model=AnalysisResult)
async def analyze_interaction(interaction_id: str):
    if not sentiment_pipeline:
        raise HTTPException(status_code=503, detail="Sentiment analysis model is not available.")
    try:
        obj_id = ObjectId(interaction_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid interaction ID format.")
    interaction = await interaction_collection.find_one({"_id": obj_id})
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    teacher_texts = [line['text'] for line in interaction['transcript'] if line.get('speaker', '').lower() == 'teacher']
    if not teacher_texts:
        raise HTTPException(status_code=400, detail="No text from the teacher found in the transcript to analyze.")
    results = sentiment_pipeline(teacher_texts)
    positive_count = sum(1 for r in results if r['label'] == 'POSITIVE')
    negative_count = len(results) - positive_count
    total_statements = len(results)
    positive_ratio = positive_count / total_statements if total_statements > 0 else 0
    empathy_score = positive_ratio * 100
    feedback = []
    if positive_ratio > 0.7:
        feedback.append("Excellent use of positive language to create a supportive tone.")
    elif positive_ratio < 0.4:
        feedback.append("Consider using more encouraging and positive words to build rapport.")
    else:
        feedback.append("Good balance of language. Keep fostering a positive environment.")
    if negative_count > 0:
        feedback.append(f"Found {negative_count} statement(s) that could be perceived negatively. Review them for a more constructive phrasing.")
    sentiment_summary = {
        'positive': round(positive_ratio, 2),
        'negative': round(negative_count / total_statements if total_statements > 0 else 0, 2),
    }
    return AnalysisResult(
        interactionId=interaction_id,
        overallEmpathyScore=round(empathy_score, 2),
        sentiment=sentiment_summary,
        feedback=feedback
    )
