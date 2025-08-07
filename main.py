from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv
from datetime import datetime
import uvicorn
import json
from typing import List, Dict, Any, Optional
import uuid

# Import models and services
from models.user import User, UserCreate, UserLogin, UserUpdate
from models.complaint import Complaint, ComplaintCreate, ComplaintUpdate, ComplaintFilter, ComplaintAnalytics
from models.chat import ChatMessage, ChatSession, ChatMessageCreate, ChatResponse
from services.firebase_service import FirebaseService
from services.ai_service import AIService
from services.chatbot_service import ChatbotService
from services.notification_service import NotificationService

# Load environment variables
load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"))
    firebase_admin.initialize_app(cred)

# Create FastAPI app
app = FastAPI(
    title="Complaint Management System API",
    description="AI-powered complaint management system with chatbot integration",
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
security = HTTPBearer()

# Initialize services
firebase_service = FirebaseService()
ai_service = AIService()
chatbot_service = ChatbotService()
notification_service = NotificationService(firebase_service)

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    try:
        token = credentials.credentials
        decoded_token = await firebase_service.verify_token(token)
        if not decoded_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        user_id = decoded_token['uid']
        user = await firebase_service.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user
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
    return {"message": "Complaint Management System API"}

# Authentication routes
@app.post("/auth/register", response_model=Dict[str, Any])
async def register(user_data: UserCreate):
    try:
        user = await firebase_service.create_user(user_data.dict())
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
        # In a real implementation, you would verify the password
        # For now, we'll just check if the user exists
        user = await firebase_service.get_user_by_email(login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Create custom token
        custom_token = await firebase_service.create_custom_token(user['id'])
        
        return {
            "message": "Login successful",
            "user": user,
            "token": custom_token
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

@app.put("/users/me", response_model=Dict[str, Any])
async def update_user_info(
    update_data: UserUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        updated_user = await firebase_service.update_user(
            current_user['id'],
            update_data.dict(exclude_unset=True)
        )
        return updated_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Complaint routes
@app.post("/complaints", response_model=Dict[str, Any])
async def create_complaint(
    complaint_data: ComplaintCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        # Use AI to categorize and prioritize if not provided
        if not complaint_data.category:
            category, confidence = ai_service.categorize_complaint(
                complaint_data.title, complaint_data.description
            )
        else:
            category = complaint_data.category
            confidence = 0.8
        
        if not complaint_data.priority:
            priority, pri_confidence = ai_service.prioritize_complaint(
                complaint_data.title, complaint_data.description, category
            )
        else:
            priority = complaint_data.priority
            pri_confidence = 0.8
        
        # Get AI suggestions
        suggestions = ai_service.get_ai_suggestions({
            'title': complaint_data.title,
            'description': complaint_data.description,
            'category': category,
            'priority': priority
        })
        
        # Create complaint
        complaint_doc = {
            'user_id': current_user['id'],
            'title': complaint_data.title,
            'description': complaint_data.description,
            'category': category,
            'priority': priority,
            'ai_confidence': (confidence + pri_confidence) / 2,
            'ai_suggestions': suggestions,
            'tags': complaint_data.tags or [],
            'attachments': complaint_data.attachments or []
        }
        
        complaint = await firebase_service.create_complaint(complaint_doc)
        
        return {
            "message": "Complaint created successfully",
            "complaint": complaint
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
        complaints = await firebase_service.get_user_complaints(current_user['id'], limit)
        return complaints
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
        complaint = await firebase_service.get_complaint(complaint_id)
        if not complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found"
            )
        
        # Check if user owns the complaint or is admin
        if complaint['user_id'] != current_user['id'] and current_user.get('role') != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return complaint
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.put("/complaints/{complaint_id}", response_model=Dict[str, Any])
async def update_complaint(
    complaint_id: str,
    update_data: ComplaintUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        complaint = await firebase_service.get_complaint(complaint_id)
        if not complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found"
            )
        
        # Check if user owns the complaint or is admin
        if complaint['user_id'] != current_user['id'] and current_user.get('role') != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        updated_complaint = await firebase_service.update_complaint(
            complaint_id,
            update_data.dict(exclude_unset=True)
        )
        
        return updated_complaint
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Admin routes
@app.get("/admin/complaints", response_model=List[Dict[str, Any]])
async def get_all_complaints_admin(
    current_user: Dict[str, Any] = Depends(get_current_user),
    status_filter: Optional[str] = None,
    category_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    limit: int = 100
):
    if current_user.get('role') != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    try:
        filters = {}
        if status_filter:
            filters['status'] = status_filter
        if category_filter:
            filters['category'] = category_filter
        if priority_filter:
            filters['priority'] = priority_filter
        
        complaints = await firebase_service.get_all_complaints(filters, limit)
        return complaints
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/admin/analytics", response_model=Dict[str, Any])
async def get_analytics(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    try:
        analytics = await firebase_service.get_complaint_analytics()
        return analytics
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
        # Process message through chatbot
        response = chatbot_service.process_message(
            current_user['id'],
            message_data.message,
            message_data.session_id
        )
        
        # Save user message to database
        user_message_data = {
            'session_id': response.session_id,
            'user_id': current_user['id'],
            'message': message_data.message,
            'message_type': 'user',
            'role': 'user',
            'complaint_id': message_data.complaint_id
        }
        
        await firebase_service.save_chat_message(user_message_data)
        
        # Save bot response to database
        bot_message_data = {
            'session_id': response.session_id,
            'user_id': current_user['id'],
            'message': response.message,
            'message_type': 'bot',
            'role': 'assistant',
            'intent': response.intent,
            'confidence': response.confidence,
            'complaint_id': response.complaint_id
        }
        
        await firebase_service.save_chat_message(bot_message_data)
        
        return {
            "message": "Message processed successfully",
            "response": response.dict()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/chat/history/{session_id}", response_model=List[Dict[str, Any]])
async def get_chat_history(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        history = await firebase_service.get_chat_history(session_id)
        return history
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/chat/sessions", response_model=List[Dict[str, Any]])
async def get_user_chat_sessions(current_user: Dict[str, Any] = Depends(get_current_user)):
    try:
        # Get active sessions for the user
        active_sessions = chatbot_service.get_active_sessions()
        user_sessions = [s for s in active_sessions if s.user_id == current_user['id']]
        
        return [session.dict() for session in user_sessions]
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
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process message through chatbot
            response = chatbot_service.process_message(
                user_id,
                message_data['message'],
                message_data.get('session_id')
            )
            
            # Send response back to client
            await websocket.send_text(json.dumps(response.dict()))
            
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for user {user_id}")

# AI model training endpoint
@app.post("/ai/train")
async def train_ai_models(
    training_data: List[Dict[str, Any]],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    if current_user.get('role') != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    try:
        ai_service.train_models(training_data)
        return {"message": "AI models trained successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Notification routes
@app.get("/notifications", response_model=List[Dict[str, Any]])
async def get_user_notifications(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 50
):
    """Get notifications for the current user"""
    try:
        notifications = await notification_service.get_user_notifications(current_user['id'], limit)
        return notifications
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Mark a notification as read"""
    try:
        success = await notification_service.mark_notification_read(notification_id)
        if success:
            return {"message": "Notification marked as read"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Escalation routes
@app.post("/complaints/{complaint_id}/escalate")
async def escalate_complaint(
    complaint_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Manually escalate a complaint"""
    try:
        # Check if user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        # Get current complaint
        complaint = await firebase_service.get_complaint(complaint_id)
        if not complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found"
            )
        
        # Update escalation level
        current_level = complaint.get('escalation_level', 0)
        await firebase_service.update_complaint(complaint_id, {
            'escalation_level': current_level + 1,
            'updated_at': datetime.now().isoformat()
        })
        
        # Send escalation notification
        await notification_service.send_complaint_notification(complaint_id, "escalated")
        
        return {"message": "Complaint escalated successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/admin/auto-escalate")
async def auto_escalate_complaints(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Automatically escalate complaints that meet escalation criteria"""
    try:
        # Check if user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        escalated_complaints = await notification_service.auto_escalate_complaints()
        
        return {
            "message": f"Auto-escalation completed",
            "escalated_count": len(escalated_complaints),
            "escalated_complaints": escalated_complaints
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/complaints/{complaint_id}/notify")
async def send_complaint_notification(
    complaint_id: str,
    notification_type: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Send a notification for a specific complaint"""
    try:
        # Check if user is admin
        if current_user.get('role') != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        success = await notification_service.send_complaint_notification(complaint_id, notification_type)
        
        if success:
            return {"message": "Notification sent successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 