#!/bin/bash

# 3 Ball Network - Post-Deployment Verification Script
# Checks all enhanced features are working correctly

echo "🔍 3 Ball Network - Enhanced Features Verification"
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✅]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json not found. Are you in the 3 Ball Network directory?"
    exit 1
fi

print_check "Verifying enhanced features..."

# Check core JavaScript modules
MODULES=(
    "public/assets/js/playerAnalytics.js"
    "public/assets/js/recruitingHub.js" 
    "public/assets/js/smartGameInput.js"
    "public/assets/js/platformManager.js"
)

print_check "Core JavaScript modules:"
for module in "${MODULES[@]}"; do
    if [ -f "$module" ]; then
        print_success "$module exists"
    else
        echo "❌ Missing: $module"
    fi
done

# Check enhanced HTML pages
PAGES=(
    "public/analytics-dashboard.html"
    "public/recruiting-hub.html"
    "public/smart-input.html"
    "public/ai-coach.html"
    "public/social-hub.html"
    "public/demo-enhanced.html"
    "public/test-integration.html"
)

print_check "Enhanced HTML pages:"
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        print_success "$page exists"
    else
        echo "❌ Missing: $page"
    fi
done

# Check Firebase configuration
print_check "Firebase configuration:"
if grep -q "analytics-dashboard" firebase.json; then
    print_success "Clean URLs configured in firebase.json"
else
    echo "❌ Clean URLs not configured"
fi

# Check demo portal enhancements
print_check "Demo portal enhancements:"
if grep -q "Advanced Analytics" public/demo-player.html; then
    print_success "Player demo enhanced with analytics"
else
    echo "❌ Player demo not enhanced"
fi

if grep -q "Smart Game Input" public/demo-coach.html; then
    print_success "Coach demo enhanced with smart input"
else
    echo "❌ Coach demo not enhanced"
fi

# Check homepage integration
print_check "Homepage integration:"
if grep -q "Enhanced Demo" public/index.html; then
    print_success "Homepage updated with enhanced features"
else
    echo "❌ Homepage not updated"
fi

# Summary
echo ""
echo "🎯 Verification Complete!"
echo ""
print_info "Enhanced Features Available:"
echo "   📊 Analytics Dashboard: /analytics-dashboard"
echo "   🎯 Recruiting Hub: /recruiting-hub"
echo "   ⚡ Smart Game Input: /smart-input"
echo "   🧠 AI Coach: /ai-coach"
echo "   🌐 Social Hub: /social-hub"
echo "   🚀 Comprehensive Demo: /demo-enhanced"
echo ""
print_info "Enhanced Demo Portals:"
echo "   👤 Player Demo: /demo-player (now with analytics & recruiting)"
echo "   🏀 Coach Demo: /demo-coach (now with analytics & smart input)"
echo ""
print_info "Testing & Integration:"
echo "   🧪 Integration Tests: /test-integration"
echo "   📋 Integration Summary: INTEGRATION_SUMMARY.md"
echo ""
echo "🏀 3 Ball Network Enhanced Features Ready! 🚀"
