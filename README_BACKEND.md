# Complaint Management System - Backend Setup Guide

## 🚀 Quick Start (Recommended)

### Option 1: Run in Demo Mode (Easiest)
This runs the backend without Firebase and AI dependencies for testing:

```bash
# 1. Navigate to backend directory
cd complaint-management-system/backend

# 2. Install core dependencies only
pip install fastapi uvicorn python-dotenv pydantic

# 3. Run the simplified version
python main_simple.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Option 2: Full Setup with Firebase and AI

#### Prerequisites
- Python 3.11 or 3.12 (recommended for better compatibility)
- Firebase project with service account key
- OpenAI API key (for AI features)

#### Step-by-Step Setup

1. **Install Python Dependencies**
   ```bash
   cd complaint-management-system/backend
   
   # Install core packages first
   pip install fastapi uvicorn firebase-admin python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv pydantic websockets pytest httpx python-socketio aiofiles Pillow openai
   
   # Install ML packages (may take time)
   pip install transformers torch scikit-learn nltk textblob sentence-transformers numpy pandas
   ```

2. **Configure Environment**
   ```bash
   # Create .env file
   echo "FIREBASE_SERVICE_ACCOUNT_KEY=firebase-service-account.json.json" > .env
   echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
   echo "HOST=0.0.0.0" >> .env
   echo "PORT=8000" >> .env
   echo "ENVIRONMENT=development" >> .env
   ```

3. **Configure Firebase**
   - Ensure `firebase-service-account.json.json` exists in the backend directory
   - Update the `.env` file with your Firebase project settings

4. **Run the Backend**
   ```bash
   python main.py
   ```

## 🔧 Troubleshooting

### Python 3.13 Issues
If you're using Python 3.13 and getting `distutils` errors:

**Solution 1: Use Python 3.11/3.12**
```bash
# Install Python 3.11 from python.org
# Create new virtual environment
python3.11 -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

**Solution 2: Install packages individually**
```bash
# Install core packages first
pip install fastapi uvicorn firebase-admin python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv pydantic

# Then install ML packages one by one
pip install transformers
pip install torch
pip install scikit-learn
# ... continue with other packages
```

### Firebase Configuration Issues
If Firebase initialization fails:

1. **Check service account file**
   ```bash
   # Ensure the file exists and is readable
   ls -la firebase-service-account.json.json
   ```

2. **Verify environment variable**
   ```bash
   # Check if .env file is loaded
   python -c "from dotenv import load_dotenv; load_dotenv(); import os; print(os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY'))"
   ```

3. **Test Firebase connection**
   ```python
   import firebase_admin
   from firebase_admin import credentials
   cred = credentials.Certificate('firebase-service-account.json.json')
   firebase_admin.initialize_app(cred)
   print("Firebase initialized successfully")
   ```

### Missing Dependencies
If you get `ModuleNotFoundError`:

```bash
# Install missing package
pip install package_name

# Or install all requirements
pip install -r requirements.txt
```

## 📋 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Complaints
- `POST /complaints` - Create complaint
- `GET /complaints` - Get user complaints
- `GET /complaints/{id}` - Get specific complaint
- `PUT /complaints/{id}` - Update complaint

### Chat
- `POST /chat/message` - Send chat message
- `GET /chat/history/{session_id}` - Get chat history
- `GET /chat/sessions` - Get user chat sessions
- `WebSocket /ws/chat/{user_id}` - Real-time chat

### Admin (Full version only)
- `GET /admin/complaints` - Get all complaints
- `GET /admin/analytics` - Get analytics
- `POST /ai/train` - Train AI models

## 🐳 Docker Alternative

If you're having issues with Python dependencies, use Docker:

```bash
# Build and run with Docker
docker build -t complaint-backend .
docker run -p 8000:8000 complaint-backend
```

## 🔍 Testing the API

1. **Health Check**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Create a Complaint (Demo Mode)**
   ```bash
   curl -X POST "http://localhost:8000/complaints" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Complaint",
       "description": "This is a test complaint",
       "category": "Technical",
       "priority": "High"
     }'
   ```

3. **View API Documentation**
   - Open http://localhost:8000/docs in your browser
   - Interactive API documentation with Swagger UI

## 🚨 Common Issues & Solutions

### Issue: "No module named 'fastapi'"
**Solution**: Install FastAPI
```bash
pip install fastapi uvicorn
```

### Issue: "Firebase initialization failed"
**Solution**: Use demo mode or configure Firebase properly
```bash
python main_simple.py  # Demo mode
```

### Issue: "distutils" error with Python 3.13
**Solution**: Use Python 3.11/3.12 or install packages individually

### Issue: Port 8000 already in use
**Solution**: Change port in main.py or kill existing process
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

## 📞 Support

If you encounter issues:

1. **Check the logs** for specific error messages
2. **Try demo mode** first: `python main_simple.py`
3. **Verify Python version**: `python --version`
4. **Check installed packages**: `pip list`

## 🎯 Next Steps

After successfully running the backend:

1. **Test the API endpoints** using the documentation at http://localhost:8000/docs
2. **Configure the frontend** to connect to the backend
3. **Set up Firebase** for production use
4. **Configure OpenAI API** for AI features

---

**Note**: The demo mode (`main_simple.py`) is perfect for testing and development. Use the full version (`main.py`) for production with proper Firebase and AI configuration. 