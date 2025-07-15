#!/bin/bash

# 🔧 CI/CD Pipeline Setup Verification Script
# This script validates that all components of the CI/CD pipeline are properly configured

set -e

echo "🚀 3 Ball Network - CI/CD Pipeline Verification"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CHECKS_TOTAL=0
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

# Function to print status
print_status() {
    local status=$1
    local message=$2
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    
    case $status in
        "PASS")
            echo -e "${GREEN}✅ PASS${NC} - $message"
            CHECKS_PASSED=$((CHECKS_PASSED + 1))
            ;;
        "FAIL")
            echo -e "${RED}❌ FAIL${NC} - $message"
            CHECKS_FAILED=$((CHECKS_FAILED + 1))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  WARN${NC} - $message"
            WARNINGS=$((WARNINGS + 1))
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  INFO${NC} - $message"
            ;;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check file exists
file_exists() {
    [ -f "$1" ]
}

# Function to check directory exists
dir_exists() {
    [ -d "$1" ]
}

echo "📋 Starting CI/CD Pipeline Verification..."
echo ""

# ===============================================
# 1. Environment Setup Checks
# ===============================================

echo "🔧 Environment Setup"
echo "-------------------"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    if [[ "$NODE_VERSION" =~ ^v1[8-9]\.|^v[2-9][0-9]\. ]]; then
        print_status "PASS" "Node.js version: $NODE_VERSION"
    else
        print_status "WARN" "Node.js version $NODE_VERSION may not be compatible (recommended: v18+)"
    fi
else
    print_status "FAIL" "Node.js not installed"
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status "PASS" "npm version: $NPM_VERSION"
else
    print_status "FAIL" "npm not installed"
fi

# Check Git
if command_exists git; then
    GIT_VERSION=$(git --version)
    print_status "PASS" "Git installed: $GIT_VERSION"
else
    print_status "FAIL" "Git not installed"
fi

# Check Firebase CLI
if command_exists firebase; then
    FIREBASE_VERSION=$(firebase --version)
    print_status "PASS" "Firebase CLI installed: $FIREBASE_VERSION"
else
    print_status "WARN" "Firebase CLI not installed (install with: npm install -g firebase-tools)"
fi

echo ""

# ===============================================
# 2. Project Structure Checks
# ===============================================

echo "📁 Project Structure"
echo "-------------------"

# Check essential files
essential_files=(
    "package.json"
    "vite.config.js"
    "firebase.json"
    "playwright.config.cjs"
    "jest.config.json"
    "eslint.config.js"
)

for file in "${essential_files[@]}"; do
    if file_exists "$file"; then
        print_status "PASS" "Essential file exists: $file"
    else
        print_status "FAIL" "Missing essential file: $file"
    fi
done

# Check workflow files
workflow_files=(
    ".github/workflows/ci-cd-pipeline.yml"
    ".github/workflows/pr-validation.yml"
    ".github/workflows/e2e-testing.yml"
    ".github/workflows/release-management.yml"
    ".github/workflows/deployment-monitoring.yml"
)

for file in "${workflow_files[@]}"; do
    if file_exists "$file"; then
        print_status "PASS" "Workflow file exists: $file"
    else
        print_status "FAIL" "Missing workflow file: $file"
    fi
done

# Check test directory
if dir_exists "tests"; then
    print_status "PASS" "Tests directory exists"
    
    # Check for test files
    if ls tests/*.test.js >/dev/null 2>&1; then
        TEST_COUNT=$(ls tests/*.test.js | wc -l)
        print_status "PASS" "Test files found: $TEST_COUNT"
    else
        print_status "WARN" "No test files found in tests directory"
    fi
else
    print_status "FAIL" "Tests directory missing"
fi

# Check scripts directory
if dir_exists "scripts"; then
    print_status "PASS" "Scripts directory exists"
    SCRIPT_COUNT=$(ls scripts/*.js | wc -l 2>/dev/null || echo 0)
    print_status "INFO" "Build scripts found: $SCRIPT_COUNT"
else
    print_status "WARN" "Scripts directory missing"
fi

echo ""

# ===============================================
# 3. Dependencies Checks
# ===============================================

echo "📦 Dependencies"
echo "--------------"

if file_exists "package.json"; then
    # Check if node_modules exists
    if dir_exists "node_modules"; then
        print_status "PASS" "node_modules directory exists"
    else
        print_status "WARN" "node_modules not found - run 'npm install'"
    fi
    
    # Check package-lock.json
    if file_exists "package-lock.json"; then
        print_status "PASS" "package-lock.json exists"
    else
        print_status "WARN" "package-lock.json missing - dependencies may be inconsistent"
    fi
    
    # Check for security vulnerabilities
    if command_exists npm; then
        echo "🔍 Running security audit..."
        if npm audit --audit-level high >/dev/null 2>&1; then
            print_status "PASS" "No high-severity vulnerabilities found"
        else
            print_status "WARN" "Security vulnerabilities detected - run 'npm audit fix'"
        fi
    fi
else
    print_status "FAIL" "package.json not found"
fi

echo ""

# ===============================================
# 4. Configuration Checks
# ===============================================

echo "⚙️ Configuration"
echo "---------------"

# Check environment files
env_files=(
    ".env.example"
    ".env.local"
)

for file in "${env_files[@]}"; do
    if file_exists "$file"; then
        print_status "PASS" "Environment file exists: $file"
    else
        if [[ "$file" == ".env.local" ]]; then
            print_status "WARN" "Local environment file missing: $file (copy from .env.example)"
        else
            print_status "FAIL" "Environment template missing: $file"
        fi
    fi
done

# Check Vite config
if file_exists "vite.config.js"; then
    if grep -q "defineConfig" vite.config.js; then
        print_status "PASS" "Vite configuration appears valid"
    else
        print_status "WARN" "Vite configuration may be invalid"
    fi
fi

# Check Firebase config
if file_exists "firebase.json"; then
    if grep -q "hosting" firebase.json; then
        print_status "PASS" "Firebase hosting configuration found"
    else
        print_status "WARN" "Firebase hosting configuration missing"
    fi
    
    if grep -q "firestore" firebase.json; then
        print_status "PASS" "Firebase Firestore configuration found"
    else
        print_status "WARN" "Firebase Firestore configuration missing"
    fi
fi

# Check Firestore rules
if file_exists "firestore.rules"; then
    print_status "PASS" "Firestore security rules exist"
else
    print_status "FAIL" "Firestore security rules missing"
fi

echo ""

# ===============================================
# 5. Testing Setup Checks
# ===============================================

echo "🧪 Testing Setup"
echo "---------------"

# Check Jest configuration
if file_exists "jest.config.json"; then
    print_status "PASS" "Jest configuration exists"
else
    print_status "FAIL" "Jest configuration missing"
fi

# Check Playwright configuration
if file_exists "playwright.config.cjs"; then
    print_status "PASS" "Playwright configuration exists"
    
    # Check if Playwright browsers are installed
    if command_exists npx; then
        if npx playwright --version >/dev/null 2>&1; then
            print_status "PASS" "Playwright is installed"
        else
            print_status "WARN" "Playwright browsers may not be installed - run 'npx playwright install'"
        fi
    fi
else
    print_status "FAIL" "Playwright configuration missing"
fi

# Check for test helpers
if file_exists "tests/test-helpers.js"; then
    print_status "PASS" "Test helpers found"
else
    print_status "WARN" "Test helpers missing"
fi

echo ""

# ===============================================
# 6. Build System Checks
# ===============================================

echo "🏗️ Build System"
echo "---------------"

if file_exists "package.json"; then
    # Check for essential scripts
    essential_scripts=(
        "dev"
        "build"
        "test"
        "lint"
    )
    
    for script in "${essential_scripts[@]}"; do
        if grep -q "\"$script\":" package.json; then
            print_status "PASS" "Script exists: $script"
        else
            print_status "FAIL" "Missing script: $script"
        fi
    done
    
    # Try to run build
    if command_exists npm && dir_exists "node_modules"; then
        echo "🔨 Testing build process..."
        if npm run build:prod >/dev/null 2>&1; then
            print_status "PASS" "Build process successful"
            
            # Check if dist directory was created
            if dir_exists "dist"; then
                print_status "PASS" "Build output directory created"
            else
                print_status "WARN" "Build output directory not found"
            fi
        else
            print_status "WARN" "Build process failed (may require Firebase config)"
            print_status "INFO" "Build failures are often due to missing environment variables"
        fi
    else
        print_status "INFO" "Skipping build test (dependencies not installed)"
    fi
fi

echo ""

# ===============================================
# 7. Git and GitHub Setup
# ===============================================

echo "📡 Git & GitHub"
echo "--------------"

# Check if in git repository
if git rev-parse --git-dir >/dev/null 2>&1; then
    print_status "PASS" "Git repository initialized"
    
    # Check for remote origin
    if git remote get-url origin >/dev/null 2>&1; then
        ORIGIN_URL=$(git remote get-url origin)
        print_status "PASS" "Git remote origin configured: $ORIGIN_URL"
    else
        print_status "WARN" "Git remote origin not configured"
    fi
    
    # Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    print_status "INFO" "Current branch: $CURRENT_BRANCH"
    
else
    print_status "FAIL" "Not a git repository"
fi

# Check .gitignore
if file_exists ".gitignore"; then
    print_status "PASS" ".gitignore exists"
    
    # Check for essential ignores
    essential_ignores=("node_modules" "dist" ".env.local")
    for ignore in "${essential_ignores[@]}"; do
        if grep -q "$ignore" .gitignore; then
            print_status "PASS" "Ignoring: $ignore"
        else
            print_status "WARN" "Not ignoring: $ignore (add to .gitignore)"
        fi
    done
else
    print_status "FAIL" ".gitignore missing"
fi

echo ""

# ===============================================
# 8. Security Checks
# ===============================================

echo "🔒 Security"
echo "----------"

# Check for secrets in files
echo "🔍 Scanning for potential secrets..."

secret_patterns=(
    "api[_-]?key\s*[:=]\s*['\"][^'\"]+['\"]"
    "secret\s*[:=]\s*['\"][^'\"]+['\"]"
)

found_secrets=false
for pattern in "${secret_patterns[@]}"; do
    if grep -r -E "$pattern" --include="*.js" --include="*.json" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=public-backup --exclude="tests/*" . >/dev/null 2>&1; then
        # Check if it's in environment variable usage (which is OK)
        if ! grep -r -E "$pattern" --include="*.js" --include="*.json" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=public-backup --exclude="tests/*" . | grep -E "(process\.env|import\.meta\.env)" >/dev/null 2>&1; then
            print_status "WARN" "Potential hardcoded secret found: $pattern"
            found_secrets=true
        fi
    fi
done

if [ "$found_secrets" = false ]; then
    print_status "PASS" "No hardcoded secrets detected"
fi

# Check for HTTPS configuration
if file_exists "vite.config.js"; then
    if grep -q "https" vite.config.js; then
        print_status "PASS" "HTTPS configuration found"
    else
        print_status "INFO" "HTTPS configuration not explicitly set"
    fi
fi

echo ""

# ===============================================
# 9. Final Recommendations
# ===============================================

echo "💡 Recommendations"
echo "-----------------"

recommendations=()

if [ $CHECKS_FAILED -gt 0 ]; then
    recommendations+=("Fix all failed checks before proceeding with deployment")
fi

if [ $WARNINGS -gt 0 ]; then
    recommendations+=("Address warnings to improve pipeline reliability")
fi

if ! command_exists firebase; then
    recommendations+=("Install Firebase CLI: npm install -g firebase-tools")
fi

if ! file_exists ".env.local"; then
    recommendations+=("Create .env.local from .env.example with your configuration")
fi

if ! dir_exists "node_modules"; then
    recommendations+=("Install dependencies: npm install")
fi

if [ ${#recommendations[@]} -eq 0 ]; then
    recommendations+=("Setup looks good! Consider running 'npm run test:all' to validate functionality")
fi

for rec in "${recommendations[@]}"; do
    print_status "INFO" "$rec"
done

echo ""

# ===============================================
# 10. Summary Report
# ===============================================

echo "📊 Verification Summary"
echo "======================"
echo -e "Total Checks: ${BLUE}$CHECKS_TOTAL${NC}"
echo -e "Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Failed: ${RED}$CHECKS_FAILED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

# Calculate success rate
if [ $CHECKS_TOTAL -gt 0 ]; then
    SUCCESS_RATE=$(( (CHECKS_PASSED * 100) / CHECKS_TOTAL ))
    echo -e "Success Rate: ${BLUE}$SUCCESS_RATE%${NC}"
    echo ""
fi

# Overall status
if [ $CHECKS_FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}🎉 All checks passed! Your CI/CD pipeline is ready.${NC}"
    else
        echo -e "${YELLOW}⚠️  Setup is functional but has warnings. Consider addressing them.${NC}"
    fi
else
    echo -e "${RED}❌ Setup has critical issues that need to be fixed.${NC}"
fi

echo ""
echo "📖 For detailed setup instructions, see: CI_CD_DOCUMENTATION.md"
echo "🔧 For troubleshooting, check the documentation or create an issue on GitHub"
echo ""

# Exit with appropriate code
if [ $CHECKS_FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi
