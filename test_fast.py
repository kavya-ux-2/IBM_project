#!/usr/bin/env python3
"""
Simple test script for the fast backend
"""

import sys
import subprocess
import time
import requests

def test_imports():
    """Test if all required modules can be imported"""
    print("🔍 Testing imports...")
    
    try:
        import fastapi
        print("✅ FastAPI imported successfully")
    except ImportError as e:
        print(f"❌ FastAPI import failed: {e}")
        return False
    
    try:
        import uvicorn
        print("✅ Uvicorn imported successfully")
    except ImportError as e:
        print(f"❌ Uvicorn import failed: {e}")
        return False
    
    try:
        import pydantic
        print("✅ Pydantic imported successfully")
    except ImportError as e:
        print(f"❌ Pydantic import failed: {e}")
        return False
    
    return True

def test_backend_startup():
    """Test if the backend can start"""
    print("\n🚀 Testing backend startup...")
    
    try:
        # Import the main app
        from main_fast import app
        print("✅ Backend app imported successfully")
        
        # Test a simple endpoint
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        response = client.get("/health")
        if response.status_code == 200:
            print("✅ Health endpoint working")
            return True
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Backend startup failed: {e}")
        return False

def main():
    print("🧪 Testing Fast Backend Setup")
    print("=" * 40)
    
    # Test imports
    if not test_imports():
        print("\n❌ Import test failed. Please install dependencies:")
        print("pip install fastapi uvicorn python-multipart python-dotenv")
        sys.exit(1)
    
    # Test backend
    if not test_backend_startup():
        print("\n❌ Backend test failed.")
        sys.exit(1)
    
    print("\n✅ All tests passed! Backend is ready to run.")
    print("\nTo start the backend:")
    print("python main_fast.py")
    
    print("\nTo start the frontend:")
    print("npm run dev")

if __name__ == "__main__":
    main()
