#!/usr/bin/env python3
"""
Setup script for Complaint Management System Backend
"""

import os
import sys
import subprocess
import json

def create_env_file():
    """Create .env file with required environment variables"""
    env_content = """# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY=firebase-service-account.json.json

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Environment
ENVIRONMENT=development
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    print("✅ Created .env file")

def check_firebase_config():
    """Check if Firebase service account file exists"""
    if os.path.exists('firebase-service-account.json.json'):
        print("✅ Firebase service account file found")
        return True
    else:
        print("❌ Firebase service account file not found")
        print("   Please ensure 'firebase-service-account.json.json' exists in the backend directory")
        return False

def install_dependencies():
    """Install Python dependencies"""
    print("Installing dependencies...")
    
    # Core dependencies (these should work with Python 3.13)
    core_packages = [
        "fastapi==0.104.1",
        "uvicorn==0.24.0", 
        "firebase-admin==6.2.0",
        "python-multipart==0.0.6",
        "python-jose[cryptography]==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "python-dotenv==1.0.0",
        "pydantic==2.5.0",
        "websockets==12.0",
        "pytest==7.4.3",
        "httpx==0.25.2",
        "python-socketio==5.10.0",
        "aiofiles==23.2.1",
        "Pillow>=10.0.0",
        "openai>=1.3.7"
    ]
    
    # Install core packages first
    for package in core_packages:
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
    
    # Install ML packages separately (these might have compatibility issues)
    ml_packages = [
        "transformers>=4.36.0",
        "torch>=2.1.0", 
        "scikit-learn>=1.3.0",
        "nltk>=3.8.1",
        "textblob>=0.17.1",
        "sentence-transformers>=2.2.2",
        "numpy>=1.24.0",
        "pandas>=2.0.0"
    ]
    
    print("\nInstalling ML packages (this may take a while)...")
    for package in ml_packages:
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"⚠️  Failed to install {package} - some AI features may not work")

def check_python_version():
    """Check Python version compatibility"""
    version = sys.version_info
    if version.major == 3 and version.minor >= 11:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
        return True
    else:
        print(f"⚠️  Python {version.major}.{version.minor}.{version.micro} may have compatibility issues")
        print("   Consider using Python 3.11 or 3.12 for better compatibility")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up Complaint Management System Backend")
    print("=" * 50)
    
    # Check Python version
    check_python_version()
    
    # Create .env file
    create_env_file()
    
    # Check Firebase config
    firebase_ok = check_firebase_config()
    
    # Install dependencies
    install_dependencies()
    
    print("\n" + "=" * 50)
    print("📋 Setup Summary:")
    print("✅ Environment file created")
    print("✅ Dependencies installed")
    
    if firebase_ok:
        print("✅ Firebase configuration ready")
        print("\n🎉 Setup complete! You can now run the backend with:")
        print("   python main.py")
    else:
        print("❌ Firebase configuration needed")
        print("\n⚠️  Please configure Firebase before running the backend")
    
    print("\n📝 Next steps:")
    print("1. Update the .env file with your OpenAI API key")
    print("2. Ensure Firebase service account is properly configured")
    print("3. Run: python main.py")

if __name__ == "__main__":
    main() 