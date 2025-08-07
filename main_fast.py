from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import os
from datetime import datetime
import uvicorn
import json
from typing import List, Dict, Any, Optional
import uuid
from pydantic import BaseModel

# Pydantic models for request/response
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: str

class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    attachments: Optional[List[str]] = None

class Complaint(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    category: str
    priority: str
    status: str
    created_at: str
    updated_at: str
    tags: List[str]
    attachments: List[str]

class ChatMessageCreate(BaseModel):
    message: str
    session_id: Optional[str] = None
    complaint_id: Optional[str] = None

# Create FastAPI app
app = FastAPI(
    title="Complaint Management System API",
    description="Fast complaint management system with chatbot integration",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)

# Demo data storage
demo_users = {}
demo_complaints = {}
demo_chat_sessions = {}

# Simple AI analysis function
def analyze_complaint_description(description: str) -> Dict[str, Any]:
    """Simple keyword-based analysis"""
    description_lower = description.lower()
    
    # Category classification
    category = "general"
    if any(word in description_lower for word in ["payment", "billing", "charge", "invoice", "money"]):
        category = "billing"
    elif any(word in description_lower for word in ["login", "password", "authentication", "access"]):
        category = "account"
    elif any(word in description_lower for word in ["error", "bug", "crash", "freeze", "not working"]):
        category = "technical"
    elif any(word in description_lower for word in ["service", "outage", "down", "unavailable"]):
        category = "service"
    
    # Priority determination
    priority = "medium"
    if any(word in description_lower for word in ["urgent", "emergency", "critical", "immediate"]):
        priority = "urgent"
    elif any(word in description_lower for word in ["cannot", "unable", "broken", "down", "error"]):
        priority = "high"
    elif any(word in description_lower for word in ["suggestion", "improvement", "enhancement"]):
        priority = "low"
    
    return {
        "category": category,
        "category_confidence": 0.8,
        "priority": priority,
        "priority_confidence": 0.8,
        "suggestions": [
            "Check system logs for errors",
            "Verify user permissions",
            "Contact support team if issue persists"
        ]
    }

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    if not credentials:
        return {
            'id': 'demo_user_1',
            'email': 'demo@example.com',
            'name': 'Demo User',
            'role': 'user'
        }
    
    try:
        return {
            'id': 'demo_user_1',
            'email': 'demo@example.com',
            'name': 'Demo User',
            'role': 'user'
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/")
async def root():
    return {"message": "Complaint Management System API (Fast Mode)"}

# Authentication routes
@app.post("/auth/register", response_model=Dict[str, Any])
async def register(user_data: UserCreate):
    try:
        user_id = str(uuid.uuid4())
        user = {
            'id': user_id,
            'email': user_data.email,
            'name': user_data.name,
            'role': 'user',
            'created_at': datetime.now().isoformat()
        }
        demo_users[user_id] = user
        
        return {
            "message": "User registered successfully",
            "user": user
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/auth/login", response_model=Dict[str, Any])
async def login(login_data: UserLogin):
    try:
        user = {
            'id': 'demo_user_1',
            'email': login_data.email,
            'name': 'Demo User',
            'role': 'user'
        }
        
        return {
            "message": "Login successful",
            "user": user,
            "token": "demo_token_123"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

# User routes
@app.get("/users/me", response_model=Dict[str, Any])
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    return current_user

# Complaint routes
@app.post("/complaints", response_model=Dict[str, Any])
async def create_complaint(
    complaint_data: ComplaintCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        # Analyze the complaint description
        analysis = analyze_complaint_description(complaint_data.description)
        
        category = complaint_data.category or analysis["category"]
        priority = complaint_data.priority or analysis["priority"]
        
        complaint_id = str(uuid.uuid4())
        complaint = {
            'id': complaint_id,
            'user_id': current_user['id'],
            'title': complaint_data.title,
            'description': complaint_data.description,
            'category': category,
            'priority': priority,
            'status': 'registered',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'tags': complaint_data.tags or [],
            'attachments': complaint_data.attachments or [],
            'ai_analysis': {
                'category_confidence': analysis['category_confidence'],
                'priority_confidence': analysis['priority_confidence'],
                'suggestions': analysis['suggestions'],
                'analyzed_at': datetime.now().isoformat()
            }
        }
        
        demo_complaints[complaint_id] = complaint
        
        return {
            "message": "Complaint created successfully with AI analysis",
            "complaint": complaint,
            "ai_analysis": analysis
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/complaints", response_model=List[Dict[str, Any]])
async def get_user_complaints(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 50
):
    try:
        user_complaints = [
            complaint for complaint in demo_complaints.values()
            if complaint['user_id'] == current_user['id']
        ]
        return user_complaints[:limit]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/complaints/{complaint_id}", response_model=Dict[str, Any])
async def get_complaint(
    complaint_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        complaint = demo_complaints.get(complaint_id)
        if not complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found"
            )
        
        return complaint
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Chat routes
@app.post("/chat/message", response_model=Dict[str, Any])
async def send_chat_message(
    message_data: ChatMessageCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        user_message = message_data.message.lower()
        response_message = ""
        intent = "general"
        confidence = 0.8
        analysis = None
        
        # Check if this is a complaint description
        if len(message_data.message) > 20 and any(word in user_message for word in ["problem", "issue", "error", "broken", "not working"]):
            analysis = analyze_complaint_description(message_data.message)
            
            category = analysis["category"]
            priority = analysis["priority"]
            suggestions = analysis["suggestions"]
            
            response_message = f"I've analyzed your complaint and here's what I found:\n\n"
            response_message += f"📋 **Category**: {category.title()}\n"
            response_message += f"🚨 **Priority**: {priority.title()}\n\n"
            
            if priority == "urgent":
                response_message += "⚠️ **URGENT**: This requires immediate attention!\n\n"
            elif priority == "high":
                response_message += "🔴 **HIGH PRIORITY**: This will be escalated quickly.\n\n"
            
            response_message += "💡 **AI Suggestions**:\n"
            for i, suggestion in enumerate(suggestions[:3], 1):
                response_message += f"{i}. {suggestion}\n"
            
            response_message += f"\nWould you like me to create a complaint ticket with these settings?"
            
            intent = "complaint_analysis"
            confidence = 0.9
            
        elif "complaint" in user_message or "issue" in user_message:
            response_message = "I can help you log a complaint. Please describe your issue in detail, and I'll automatically classify and prioritize it for you."
            intent = "complaint_creation"
            confidence = 0.9
        elif "status" in user_message or "check" in user_message:
            response_message = "I can help you check the status of your complaints. Do you have a specific complaint ID, or would you like me to show your recent complaints?"
            intent = "status_check"
            confidence = 0.9
        elif "help" in user_message:
            response_message = "I'm here to help! You can:\n• Log new complaints (I'll auto-classify them)\n• Check complaint status\n• Get information about our services\n• Ask general questions"
            intent = "help"
            confidence = 0.95
        elif "hello" in user_message or "hi" in user_message:
            response_message = f"Hello {current_user.get('name', 'there')}! How can I assist you today?"
            intent = "greeting"
            confidence = 0.9
        else:
            response_message = "I understand you're asking about that. Let me help you with your complaint management needs. Would you like to log a new complaint, check the status of existing ones, or get help with something specific?"
            intent = "general_inquiry"
            confidence = 0.7
        
        response = {
            'session_id': message_data.session_id or str(uuid.uuid4()),
            'message': response_message,
            'intent': intent,
            'confidence': confidence,
            'complaint_id': message_data.complaint_id,
            'analysis': analysis
        }
        
        return {
            "message": "Message processed successfully",
            "response": response
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# WebSocket for real-time chat
@app.websocket("/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            user_message = message_data['message'].lower()
            response_message = ""
            
            if "complaint" in user_message or "issue" in user_message:
                response_message = "I can help you log a complaint. Please provide a brief title for your issue, and I'll guide you through the process."
            elif "status" in user_message or "check" in user_message:
                response_message = "I can help you check the status of your complaints. Do you have a specific complaint ID, or would you like me to show your recent complaints?"
            elif "help" in user_message:
                response_message = "I'm here to help! You can:\n• Log new complaints\n• Check complaint status\n• Get information about our services\n• Ask general questions"
            elif "hello" in user_message or "hi" in user_message:
                response_message = "Hello! How can I assist you today?"
            else:
                response_message = "I understand you're asking about that. Let me help you with your complaint management needs."
            
            response = {
                'session_id': message_data.get('session_id', str(uuid.uuid4())),
                'message': response_message,
                'intent': 'general',
                'confidence': 0.8
            }
            
            await websocket.send_text(json.dumps(response))
            
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for user {user_id}")

if __name__ == "__main__":
    print("🚀 Starting Complaint Management System Backend (Fast Mode)")
    print("📝 Note: This is running in fast mode without heavy dependencies")
    print("🌐 API will be available at: http://localhost:8000")
    print("📖 API documentation at: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
