from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from datetime import datetime
import uvicorn
import json
from typing import List, Dict, Any, Optional
import uuid

# Import models
from models.user import User, UserCreate, UserLogin, UserUpdate
from models.complaint import Complaint, ComplaintCreate, ComplaintUpdate, ComplaintFilter, ComplaintAnalytics
from models.chat import ChatMessage, ChatSession, ChatMessageCreate, ChatResponse

# Load environment variables
load_dotenv()

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
security = HTTPBearer(auto_error=False)

# Demo data storage (for testing without Firebase)
demo_users = {}
demo_complaints = {}
demo_chat_sessions = {}

# AI-powered complaint classification and prioritization
def analyze_complaint_description(description: str) -> Dict[str, Any]:
    """
    Analyze complaint description to classify category and determine priority
    """
    description_lower = description.lower()
    
    # Category classification
    category = "general"
    category_confidence = 0.7
    
    if any(word in description_lower for word in ["payment", "billing", "charge", "invoice", "money", "refund", "credit"]):
        category = "billing"
        category_confidence = 0.9
    elif any(word in description_lower for word in ["login", "password", "authentication", "access", "account", "sign in"]):
        category = "account"
        category_confidence = 0.9
    elif any(word in description_lower for word in ["error", "bug", "crash", "freeze", "not working", "broken", "technical"]):
        category = "technical"
        category_confidence = 0.85
    elif any(word in description_lower for word in ["service", "outage", "down", "unavailable", "slow", "performance"]):
        category = "service"
        category_confidence = 0.8
    elif any(word in description_lower for word in ["feature", "request", "enhancement", "improvement", "suggestion"]):
        category = "product"
        category_confidence = 0.8
    elif any(word in description_lower for word in ["mobile", "app", "android", "ios", "phone"]):
        category = "technical"
        category_confidence = 0.8
    elif any(word in description_lower for word in ["website", "web", "browser", "online"]):
        category = "technical"
        category_confidence = 0.8
    elif any(word in description_lower for word in ["data", "privacy", "security", "breach", "hack"]):
        category = "account"
        category_confidence = 0.9
    
    # Priority determination
    priority = "medium"
    priority_confidence = 0.7
    
    # High priority indicators
    if any(word in description_lower for word in ["urgent", "emergency", "critical", "immediate", "asap", "now"]):
        priority = "high"
        priority_confidence = 0.95
    elif any(word in description_lower for word in ["cannot", "unable", "broken", "down", "error", "failed", "not working"]):
        priority = "high"
        priority_confidence = 0.85
    elif any(word in description_lower for word in ["payment", "billing", "money", "charge", "refund"]):
        priority = "high"
        priority_confidence = 0.8
    elif any(word in description_lower for word in ["security", "breach", "hack", "privacy", "data"]):
        priority = "high"
        priority_confidence = 0.9
    
    # Low priority indicators
    elif any(word in description_lower for word in ["suggestion", "improvement", "enhancement", "feature request", "nice to have"]):
        priority = "low"
        priority_confidence = 0.8
    elif any(word in description_lower for word in ["cosmetic", "design", "look", "appearance", "style"]):
        priority = "low"
        priority_confidence = 0.7
    
    # Urgent priority (highest)
    if any(word in description_lower for word in ["emergency", "critical", "system down", "complete failure", "security breach"]):
        priority = "urgent"
        priority_confidence = 0.95
    
    return {
        "category": category,
        "category_confidence": category_confidence,
        "priority": priority,
        "priority_confidence": priority_confidence,
        "suggestions": generate_suggestions(category, priority, description_lower)
    }

def generate_suggestions(category: str, priority: str, description: str) -> List[str]:
    """
    Generate AI suggestions based on category and priority
    """
    suggestions = []
    
    if priority == "urgent":
        suggestions.append("Immediate escalation to senior support team")
        suggestions.append("24/7 monitoring and status updates")
        suggestions.append("Direct communication with affected users")
    
    elif priority == "high":
        suggestions.append("Escalate to specialized team")
        suggestions.append("Set up automated monitoring")
        suggestions.append("Regular status updates every 2 hours")
    
    if category == "billing":
        suggestions.append("Verify payment gateway status")
        suggestions.append("Check user account permissions")
        suggestions.append("Review transaction logs")
    
    elif category == "technical":
        suggestions.append("Check system logs for errors")
        suggestions.append("Verify system dependencies")
        suggestions.append("Test in different environments")
    
    elif category == "account":
        suggestions.append("Verify user authentication")
        suggestions.append("Check account permissions")
        suggestions.append("Review security settings")
    
    elif category == "service":
        suggestions.append("Check server status and resources")
        suggestions.append("Monitor performance metrics")
        suggestions.append("Verify third-party service status")
    
    return suggestions

# Dependency to get current user (simplified for demo)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    if not credentials:
        # For demo purposes, create a default user
        return {
            'id': 'demo_user_1',
            'email': 'demo@example.com',
            'name': 'Demo User',
            'role': 'user'
        }
    
    try:
        token = credentials.credentials
        # In a real implementation, verify the token
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
    return {"message": "Complaint Management System API (Demo Mode)"}

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
        # Demo login - always successful
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

# Complaint routes with AI analysis
@app.post("/complaints", response_model=Dict[str, Any])
async def create_complaint(
    complaint_data: ComplaintCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        # Analyze the complaint description for AI-powered classification
        analysis = analyze_complaint_description(complaint_data.description)
        
        # Use AI analysis if no category/priority provided, otherwise use provided values
        # Convert AI analysis values to match enum format (lowercase)
        ai_category = analysis["category"].lower() if analysis["category"] else "general"
        ai_priority = analysis["priority"].lower() if analysis["priority"] else "medium"
        
        category = complaint_data.category or ai_category
        priority = complaint_data.priority or ai_priority
        
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
            # AI analysis metadata
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

# Chat routes with AI-powered complaint analysis
@app.post("/chat/message", response_model=Dict[str, Any])
async def send_chat_message(
    message_data: ChatMessageCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        # Intelligent response based on user message
        user_message = message_data.message.lower()
        response_message = ""
        intent = "general"
        confidence = 0.8
        analysis = None
        
        # Check if this is a complaint description (longer message with problem details)
        if len(message_data.message) > 20 and any(word in user_message for word in ["problem", "issue", "error", "broken", "not working", "cannot", "unable"]):
            # Analyze the complaint description
            analysis = analyze_complaint_description(message_data.message)
            
            # Generate intelligent response based on analysis
            category = analysis["category"]
            priority = analysis["priority"]
            suggestions = analysis["suggestions"]
            
            response_message = f"I've analyzed your complaint and here's what I found:\n\n"
            response_message += f"📋 **Category**: {category.title()} (confidence: {analysis['category_confidence']:.1%})\n"
            response_message += f"🚨 **Priority**: {priority.title()} (confidence: {analysis['priority_confidence']:.1%})\n\n"
            
            if priority == "urgent":
                response_message += "⚠️ **URGENT**: This requires immediate attention!\n\n"
            elif priority == "high":
                response_message += "🔴 **HIGH PRIORITY**: This will be escalated quickly.\n\n"
            
            response_message += "💡 **AI Suggestions**:\n"
            for i, suggestion in enumerate(suggestions[:3], 1):
                response_message += f"{i}. {suggestion}\n"
            
            response_message += f"\nWould you like me to create a complaint ticket with these settings, or would you like to modify anything?"
            
            intent = "complaint_analysis"
            confidence = 0.9
            
        elif "complaint" in user_message or "issue" in user_message or "problem" in user_message:
            response_message = "I can help you log a complaint. Please describe your issue in detail, and I'll automatically classify and prioritize it for you. What type of problem are you experiencing?"
            intent = "complaint_creation"
            confidence = 0.9
        elif "status" in user_message or "check" in user_message:
            response_message = "I can help you check the status of your complaints. Do you have a specific complaint ID, or would you like me to show your recent complaints?"
            intent = "status_check"
            confidence = 0.9
        elif "help" in user_message or "support" in user_message:
            response_message = "I'm here to help! You can:\n• Log new complaints (I'll auto-classify them)\n• Check complaint status\n• Get information about our services\n• Ask general questions\n\nWhat would you like to do?"
            intent = "help"
            confidence = 0.95
        elif "hello" in user_message or "hi" in user_message:
            response_message = f"Hello {current_user.get('name', 'there')}! How can I assist you today? I'm here to help with your complaints and questions."
            intent = "greeting"
            confidence = 0.9
        elif "billing" in user_message or "payment" in user_message:
            response_message = "I understand you have a billing or payment issue. Please provide more details about the problem, and I'll automatically classify and prioritize it for you."
            intent = "billing_issue"
            confidence = 0.85
        elif "technical" in user_message or "error" in user_message or "bug" in user_message:
            response_message = "I see you're experiencing a technical issue. Please describe the error or bug in detail, and I'll help you create a properly classified complaint."
            intent = "technical_issue"
            confidence = 0.85
        elif "service" in user_message or "outage" in user_message:
            response_message = "I understand there's a service issue or outage. Please provide details about the service problem, and I'll analyze and prioritize it for you."
            intent = "service_issue"
            confidence = 0.85
        elif "how" in user_message and "create" in user_message:
            response_message = "To create a complaint:\n1. Simply describe your issue to me\n2. I'll automatically classify and prioritize it\n3. Review my suggestions\n4. Confirm to create the ticket\n\nJust tell me what's wrong!"
            intent = "how_to"
            confidence = 0.9
        elif "urgent" in user_message or "emergency" in user_message:
            response_message = "I understand this is urgent. Please describe the emergency situation in detail, and I'll immediately classify it as urgent and provide escalation suggestions."
            intent = "urgent_issue"
            confidence = 0.95
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
            'analysis': analysis  # Include AI analysis if available
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

# WebSocket for real-time chat (simplified)
@app.websocket("/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: str):
    await websocket.accept()
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Intelligent response based on user message
            user_message = message_data['message'].lower()
            response_message = ""
            intent = "general"
            confidence = 0.8
            
            if "complaint" in user_message or "issue" in user_message or "problem" in user_message:
                response_message = "I can help you log a complaint. Please provide a brief title for your issue, and I'll guide you through the process."
                intent = "complaint_creation"
                confidence = 0.9
            elif "status" in user_message or "check" in user_message:
                response_message = "I can help you check the status of your complaints. Do you have a specific complaint ID, or would you like me to show your recent complaints?"
                intent = "status_check"
                confidence = 0.9
            elif "help" in user_message or "support" in user_message:
                response_message = "I'm here to help! You can:\n• Log new complaints\n• Check complaint status\n• Get information about our services\n• Ask general questions"
                intent = "help"
                confidence = 0.95
            elif "hello" in user_message or "hi" in user_message:
                response_message = "Hello! How can I assist you today? I'm here to help with your complaints and questions."
                intent = "greeting"
                confidence = 0.9
            else:
                response_message = "I understand you're asking about that. Let me help you with your complaint management needs. Would you like to log a new complaint or check the status of existing ones?"
                intent = "general_inquiry"
                confidence = 0.7
            
            response = {
                'session_id': message_data.get('session_id', str(uuid.uuid4())),
                'message': response_message,
                'intent': intent,
                'confidence': confidence
            }
            
            # Send response back to client
            await websocket.send_text(json.dumps(response))
            
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for user {user_id}")

if __name__ == "__main__":
    print("🚀 Starting Complaint Management System Backend (Demo Mode)")
    print("📝 Note: This is running in demo mode without Firebase and AI features")
    print("🌐 API will be available at: http://localhost:8000")
    print("📖 API documentation at: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000) 