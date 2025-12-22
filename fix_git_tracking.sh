#!/bin/bash

echo "=== Fixing Git Tracking Issue ==="
echo ""

# Step 1: Remove Desktop-level git repository
echo "Step 1: Removing git repository from Desktop..."
cd /home/maliki/Desktop
if [ -d ".git" ]; then
    rm -rf .git
    echo "✓ Removed .git folder from Desktop"
else
    echo "✓ No .git folder found in Desktop (already removed or never existed)"
fi

echo ""
echo "Step 2: Checking frontend git repository..."
cd /home/maliki/Desktop/backend/frontend
if [ -d ".git" ]; then
    echo "✓ Frontend git repository is intact"
else
    echo "⚠ Warning: Frontend doesn't have a git repository"
fi

echo ""
echo "Step 3: Initializing git in backend folder (optional)..."
cd /home/maliki/Desktop/backend
if [ -d ".git" ]; then
    echo "✓ Backend already has a git repository"
else
    echo "Initializing new git repository in backend..."
    git init
    echo "✓ Git repository initialized in backend"
    
    # Create a proper .gitignore
    cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
myenv/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Frontend (if needed at backend level)
frontend/node_modules/
frontend/build/
frontend/dist/
EOF
    
    echo "✓ Created .gitignore file"
fi

echo ""
echo "=== Verification ==="
echo ""

# Verify Desktop is no longer a git repo
cd /home/maliki/Desktop
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Desktop is still a git repository!"
else
    echo "✓ Desktop is no longer a git repository"
fi

# Verify frontend still has git
cd /home/maliki/Desktop/backend/frontend
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✓ Frontend git repository is working"
else
    echo "⚠ Frontend git repository not found"
fi

# Check backend git status
cd /home/maliki/Desktop/backend
echo ""
echo "Backend git status:"
git status

echo ""
echo "=== Done! ==="
echo "Run 'git add .' and 'git commit -m \"Initial commit\"' in /home/maliki/Desktop/backend to commit your files"
