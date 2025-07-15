#!/bin/bash

# 🚀 Quick Setup Script for 3 Ball Network CI/CD Pipeline
# This script helps new developers get started quickly

set -e

echo "🏀 3 Ball Network - Quick Setup"
echo "==============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "Setting up your development environment..."
echo ""

# ===============================================
# 1. Check Prerequisites
# ===============================================

print_step "Checking prerequisites..."

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    if [[ "$NODE_VERSION" =~ ^v1[8-9]\.|^v[2-9][0-9]\. ]]; then
        print_success "Node.js $NODE_VERSION is compatible"
    else
        print_warning "Node.js $NODE_VERSION may not be compatible. Recommended: v18+"
        echo "Download from: https://nodejs.org/"
    fi
else
    print_error "Node.js not found. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    print_success "npm is available"
else
    print_error "npm not found. Please ensure Node.js is properly installed"
    exit 1
fi

# Check Git
if command_exists git; then
    print_success "Git is available"
else
    print_error "Git not found. Please install Git from https://git-scm.com/"
    exit 1
fi

echo ""

# ===============================================
# 2. Install Dependencies
# ===============================================

print_step "Installing project dependencies..."

if [ -f "package.json" ]; then
    npm install
    print_success "Dependencies installed successfully"
else
    print_error "package.json not found. Are you in the correct directory?"
    exit 1
fi

echo ""

# ===============================================
# 3. Setup Environment Configuration
# ===============================================

print_step "Setting up environment configuration..."

if [ -f ".env.example" ]; then
    if [ ! -f ".env.local" ]; then
        cp .env.example .env.local
        print_success "Created .env.local from template"
        print_warning "Please edit .env.local with your Firebase configuration"
        echo ""
        echo "You'll need to add:"
        echo "- VITE_FIREBASE_API_KEY"
        echo "- VITE_FIREBASE_AUTH_DOMAIN"
        echo "- VITE_FIREBASE_PROJECT_ID"
        echo "- VITE_FIREBASE_STORAGE_BUCKET"
        echo "- VITE_FIREBASE_MESSAGING_SENDER_ID"
        echo "- VITE_FIREBASE_APP_ID"
        echo ""
    else
        print_success ".env.local already exists"
    fi
else
    print_warning ".env.example not found. You'll need to create .env.local manually"
fi

echo ""

# ===============================================
# 4. Install Global Tools
# ===============================================

print_step "Installing global development tools..."

# Install Firebase CLI
if ! command_exists firebase; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    print_success "Firebase CLI installed"
else
    print_success "Firebase CLI already installed"
fi

# Install Playwright browsers
if command_exists npx; then
    echo "Installing Playwright browsers..."
    npx playwright install
    print_success "Playwright browsers installed"
fi

echo ""

# ===============================================
# 5. Verify Setup
# ===============================================

print_step "Verifying setup..."

# Check if build works
echo "Testing build process..."
if npm run build > /dev/null 2>&1; then
    print_success "Build process works"
else
    print_warning "Build process failed. Check your configuration"
fi

# Check if tests can run
echo "Testing test runner..."
if npm run test > /dev/null 2>&1; then
    print_success "Test runner works"
else
    print_warning "Test runner has issues. Check your test configuration"
fi

echo ""

# ===============================================
# 6. Git Setup
# ===============================================

print_step "Checking Git configuration..."

# Check if Git is configured
if git config --global user.name > /dev/null 2>&1 && git config --global user.email > /dev/null 2>&1; then
    print_success "Git is configured"
else
    print_warning "Git user information not set. Configure with:"
    echo "  git config --global user.name 'Your Name'"
    echo "  git config --global user.email 'your.email@example.com'"
fi

# Check if we're in a Git repository
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_success "Git repository detected"
    
    # Check for remote
    if git remote get-url origin > /dev/null 2>&1; then
        print_success "Git remote configured"
    else
        print_warning "No Git remote configured. Add with:"
        echo "  git remote add origin <repository-url>"
    fi
else
    print_warning "Not in a Git repository. Initialize with:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
fi

echo ""

# ===============================================
# 7. Next Steps
# ===============================================

echo "🎯 Next Steps"
echo "============"
echo ""

next_steps=(
    "1. Configure Firebase project:"
    "   - Go to https://console.firebase.google.com/"
    "   - Create a new project or select existing"
    "   - Enable Authentication, Firestore, and Hosting"
    "   - Copy configuration to .env.local"
    ""
    "2. Firebase CLI setup:"
    "   - Run: firebase login"
    "   - Run: firebase init (select existing project)"
    "   - Run: firebase use --add <project-id>"
    ""
    "3. Development workflow:"
    "   - Run: npm run dev (start development server)"
    "   - Run: npm run test (run tests)"
    "   - Run: npm run lint (check code quality)"
    ""
    "4. GitHub setup (for CI/CD):"
    "   - Add repository secrets in GitHub Settings > Secrets"
    "   - Configure FIREBASE_TOKEN: firebase login:ci"
    "   - Add environment variables as secrets"
    ""
    "5. Verify everything works:"
    "   - Run: ./scripts/verify-ci-cd-setup.sh"
    "   - Fix any issues reported"
)

for step in "${next_steps[@]}"; do
    echo "$step"
done

echo ""

# ===============================================
# 8. Useful Commands
# ===============================================

echo "📋 Useful Commands"
echo "================="
echo ""

commands=(
    "Development:"
    "  npm run dev          # Start development server"
    "  npm run build        # Build for production"
    "  npm run preview      # Preview production build"
    ""
    "Testing:"
    "  npm run test         # Run unit tests"
    "  npm run test:e2e     # Run end-to-end tests"
    "  npm run test:all     # Run all tests"
    ""
    "Quality:"
    "  npm run lint         # Check code quality"
    "  npm run format       # Format code"
    "  npm run quality:check # Run all quality checks"
    ""
    "Deployment:"
    "  firebase deploy      # Deploy to Firebase"
    "  npm run deploy:verify # Verify deployment"
    ""
    "Verification:"
    "  ./scripts/verify-ci-cd-setup.sh # Verify CI/CD setup"
)

for cmd in "${commands[@]}"; do
    echo "$cmd"
done

echo ""

# ===============================================
# 9. Resources
# ===============================================

echo "📚 Resources"
echo "==========="
echo ""

resources=(
    "Documentation:"
    "  - CI_CD_DOCUMENTATION.md (comprehensive setup guide)"
    "  - README.md (project overview)"
    ""
    "External Links:"
    "  - Firebase Console: https://console.firebase.google.com/"
    "  - Firebase Docs: https://firebase.google.com/docs"
    "  - Vite Docs: https://vitejs.dev/guide/"
    "  - Playwright Docs: https://playwright.dev/docs/intro"
    ""
    "Support:"
    "  - Create GitHub issue for bugs"
    "  - Use GitHub discussions for questions"
)

for resource in "${resources[@]}"; do
    echo "$resource"
done

echo ""
print_success "Setup complete! 🎉"
echo ""
print_step "Ready to start developing! Run 'npm run dev' to begin."
