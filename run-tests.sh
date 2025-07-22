#!/bin/bash

# 🧪 Complete Test Suite Runner for 3 Ball Network
# This script runs all test categories with proper setup and teardown

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="$PROJECT_ROOT/tests/reports"
COVERAGE_DIR="$PROJECT_ROOT/coverage"
REPORT_GENERATOR="$PROJECT_ROOT/scripts/test-report-generator.js"

# Test categories
UNIT_TESTS=true
INTEGRATION_TESTS=true
E2E_TESTS=true
SECURITY_TESTS=true
ACCESSIBILITY_TESTS=true
PERFORMANCE_TESTS=true
AI_TESTS=true
CHAOS_TESTS=false  # Disabled by default - can be destructive

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --unit-only)
      UNIT_TESTS=true
      INTEGRATION_TESTS=false
      E2E_TESTS=false
      SECURITY_TESTS=false
      ACCESSIBILITY_TESTS=false
      PERFORMANCE_TESTS=false
      AI_TESTS=false
      CHAOS_TESTS=false
      shift
      ;;
    --integration-only)
      UNIT_TESTS=false
      INTEGRATION_TESTS=true
      E2E_TESTS=false
      SECURITY_TESTS=false
      ACCESSIBILITY_TESTS=false
      PERFORMANCE_TESTS=false
      AI_TESTS=false
      CHAOS_TESTS=false
      shift
      ;;
    --e2e-only)
      UNIT_TESTS=false
      INTEGRATION_TESTS=false
      E2E_TESTS=true
      SECURITY_TESTS=false
      ACCESSIBILITY_TESTS=false
      PERFORMANCE_TESTS=false
      AI_TESTS=false
      CHAOS_TESTS=false
      shift
      ;;
    --security-only)
      UNIT_TESTS=false
      INTEGRATION_TESTS=false
      E2E_TESTS=false
      SECURITY_TESTS=true
      ACCESSIBILITY_TESTS=false
      PERFORMANCE_TESTS=false
      AI_TESTS=false
      CHAOS_TESTS=false
      shift
      ;;
    --accessibility-only)
      UNIT_TESTS=false
      INTEGRATION_TESTS=false
      E2E_TESTS=false
      SECURITY_TESTS=false
      ACCESSIBILITY_TESTS=true
      PERFORMANCE_TESTS=false
      AI_TESTS=false
      CHAOS_TESTS=false
      shift
      ;;
    --performance-only)
      UNIT_TESTS=false
      INTEGRATION_TESTS=false
      E2E_TESTS=false
      SECURITY_TESTS=false
      ACCESSIBILITY_TESTS=false
      PERFORMANCE_TESTS=true
      AI_TESTS=false
      CHAOS_TESTS=false
      shift
      ;;
    --ai-only)
      UNIT_TESTS=false
      INTEGRATION_TESTS=false
      E2E_TESTS=false
      SECURITY_TESTS=false
      ACCESSIBILITY_TESTS=false
      PERFORMANCE_TESTS=false
      AI_TESTS=true
      CHAOS_TESTS=false
      shift
      ;;
    --chaos)
      CHAOS_TESTS=true
      shift
      ;;
    --no-unit)
      UNIT_TESTS=false
      shift
      ;;
    --no-integration)
      INTEGRATION_TESTS=false
      shift
      ;;
    --no-e2e)
      E2E_TESTS=false
      shift
      ;;
    --no-security)
      SECURITY_TESTS=false
      shift
      ;;
    --no-accessibility)
      ACCESSIBILITY_TESTS=false
      shift
      ;;
    --no-performance)
      PERFORMANCE_TESTS=false
      shift
      ;;
    --no-ai)
      AI_TESTS=false
      shift
      ;;
    --help)
      echo "3 Ball Network Test Suite Runner"
      echo ""
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --unit-only          Run only unit tests"
      echo "  --integration-only   Run only integration tests"
      echo "  --e2e-only          Run only E2E tests"
      echo "  --security-only     Run only security tests"
      echo "  --accessibility-only Run only accessibility tests"
      echo "  --performance-only  Run only performance tests"
      echo "  --ai-only           Run only AI tests"
      echo "  --chaos             Include chaos engineering tests"
      echo "  --no-unit           Skip unit tests"
      echo "  --no-integration    Skip integration tests"
      echo "  --no-e2e            Skip E2E tests"
      echo "  --no-security       Skip security tests"
      echo "  --no-accessibility  Skip accessibility tests"
      echo "  --no-performance    Skip performance tests"
      echo "  --no-ai             Skip AI tests"
      echo "  --help              Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Utility functions
test_log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

test_log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

test_log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

test_log_error() {
  echo -e "${RED}❌ $1${NC}"
}

test_log_section() {
  echo -e "${PURPLE}$1${NC}"
}

test_log_feature() {
  echo -e "${CYAN}🔧 $1${NC}"
}

test_test_log_success() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

test_test_log_warning() {
  echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

test_test_log_error() {
  echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

test_log_feature() {
  echo -e "${PURPLE}[$(date +'%Y-%m-%d %H:%M:%S')] 🎯 $1${NC}"
}

test_test_log_section() {
  echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] 📊 $1${NC}"
}

# Beautiful report functions
show_header() {
  clear
  echo -e "${PURPLE}"
  echo "╔══════════════════════════════════════════════════════════════════╗"
  echo "║                                                                  ║"
  echo "║        🏀 3 Ball Network - Comprehensive Test Suite 🏀         ║"
  echo "║                                                                  ║"
  echo "║     Professional testing of all pages, features & systems       ║"
  echo "║                                                                  ║"
  echo "╚══════════════════════════════════════════════════════════════════╝"
  echo -e "${NC}"
  echo ""
}

show_progress() {
  local current=$1
  local total=$2
  local category=$3
  
  local percentage=$((current * 100 / total))
  local filled=$((percentage / 5))
  local empty=$((20 - filled))
  
  printf "\r${CYAN}Testing $category: ${GREEN}"
  printf "%${filled}s" | tr ' ' '█'
  printf "%${empty}s" | tr ' ' '░'
  printf "${CYAN} %d%% (%d/%d)${NC}" $percentage $current $total
}

generate_beautiful_report() {
  test_log_section "🎨 Generating beautiful HTML test report..."
  
  if [[ -f "$REPORT_GENERATOR" ]]; then
    node "$REPORT_GENERATOR"
    
    # Auto-open the report in browser
    local report_file="$PROJECT_ROOT/test-results-dashboard.html"
    if [[ -f "$report_file" ]]; then
      test_log_success "Beautiful test dashboard created!"
      echo ""
      echo -e "${GREEN}📊 Test Dashboard: ${CYAN}file://$report_file${NC}"
      echo ""
      
      # Open in browser on macOS
      if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$report_file"
        test_log_success "Test dashboard opened in your default browser!"
      else
        echo -e "${YELLOW}💡 Open this file in your browser to view the interactive test dashboard${NC}"
      fi
    fi
  else
    test_log_warning "Report generator not found at: $REPORT_GENERATOR"
  fi
}

# Setup functions
setup_environment() {
  test_log "Setting up test environment..."
  
  # Create reports directory
  mkdir -p "$REPORTS_DIR"
  mkdir -p "$COVERAGE_DIR"
  
  # Clean previous reports
  rm -rf "$REPORTS_DIR"/*
  rm -rf "$COVERAGE_DIR"/*
  
  # Set environment variables
  export NODE_ENV=test
  export CI=true
  export COVERAGE=true
  
  # Check if required services are running
  check_services
}

check_services() {
  test_log "Checking required services..."
  
  # Check if development server is running
  if ! curl -s http://localhost:3000 > /dev/null; then
    test_log_warning "Development server not running. Starting..."
    npm run dev &
    DEV_SERVER_PID=$!
    
    # Wait for server to start
    for i in {1..30}; do
      if curl -s http://localhost:3000 > /dev/null; then
        test_log_success "Development server started"
        break
      fi
      sleep 2
    done
    
    if ! curl -s http://localhost:3000 > /dev/null; then
      test_log_error "Failed to start development server"
      exit 1
    fi
  else
    test_log_success "Development server is running"
  fi
  
  # Check Firebase emulators
  if [[ "$INTEGRATION_TESTS" == true || "$E2E_TESTS" == true ]]; then
    if ! curl -s http://localhost:8080 > /dev/null; then
      test_log_warning "Firebase emulators not running. Starting..."
      firebase emulators:start --only firestore,auth,storage &
      FIREBASE_PID=$!
      
      # Wait for emulators to start
      for i in {1..30}; do
        if curl -s http://localhost:8080 > /dev/null; then
          test_log_success "Firebase emulators started"
          break
        fi
        sleep 2
      done
      
      if ! curl -s http://localhost:8080 > /dev/null; then
        test_log_error "Failed to start Firebase emulators"
        exit 1
      fi
    else
      test_log_success "Firebase emulators are running"
    fi
  fi
}

# Test execution functions
run_unit_tests() {
  if [[ "$UNIT_TESTS" != true ]]; then
    return 0
  fi
  
  test_log "Running unit tests..."
  
  if npx jest --config=tests/config/jest.config.cjs --rootDir=. --selectProjects=unit --coverage --coverageDirectory="$COVERAGE_DIR/unit"; then
    test_log_success "Unit tests passed"
    return 0
  else
    test_log_error "Unit tests failed"
    return 1
  fi
}

run_integration_tests() {
  if [[ "$INTEGRATION_TESTS" != true ]]; then
    return 0
  fi
  
  test_log "Running integration tests..."
  
  if npx jest --config=tests/config/jest.config.cjs --selectProjects=integration --coverage --coverageDirectory="$COVERAGE_DIR/integration"; then
    test_log_success "Integration tests passed"
    return 0
  else
    test_log_error "Integration tests failed"
    return 1
  fi
}

run_e2e_tests() {
  if [[ "$E2E_TESTS" != true ]]; then
    return 0
  fi
  
  test_log "Running E2E tests..."
  
  # Run Cypress tests
  if npx cypress run --config-file tests/config/cypress.config.cjs --browser chrome; then
    test_log_success "E2E tests passed"
    return 0
  else
    test_log_error "E2E tests failed"
    return 1
  fi
}

run_security_tests() {
  if [[ "$SECURITY_TESTS" != true ]]; then
    return 0
  fi
  
  test_log "Running security tests..."
  
  local security_passed=true
  
  # Run security unit tests
  if ! npx jest --config=tests/config/jest.config.cjs --selectProjects=security; then
    test_log_error "Security unit tests failed"
    security_passed=false
  fi
  
  # Run OWASP ZAP security scan
  if command -v zap.sh &> /dev/null; then
    test_log "Running OWASP ZAP security scan..."
    if ! zap.sh -cmd -quickurl http://localhost:3000 -quickout "$REPORTS_DIR/zap-report.html"; then
      test_log_error "OWASP ZAP scan failed"
      security_passed=false
    fi
  else
    test_log_warning "OWASP ZAP not installed, skipping automated security scan"
  fi
  
  # Run Snyk vulnerability scan
  if command -v snyk &> /dev/null; then
    test_log "Running Snyk vulnerability scan..."
    if ! snyk test --json > "$REPORTS_DIR/snyk-report.json"; then
      test_log_error "Snyk vulnerability scan found issues"
      security_passed=false
    fi
  else
    test_log_warning "Snyk not installed, skipping vulnerability scan"
  fi
  
  if [[ "$security_passed" == true ]]; then
    test_log_success "Security tests passed"
    return 0
  else
    test_log_error "Security tests failed"
    return 1
  fi
}

run_accessibility_tests() {
  if [[ "$ACCESSIBILITY_TESTS" != true ]]; then
    return 0
  fi
  
  test_log "Running accessibility tests..."
  
  local a11y_passed=true
  
  # Run Jest accessibility tests
  if ! npx jest --config=tests/config/jest.config.cjs --selectProjects=accessibility; then
    test_log_error "Accessibility unit tests failed"
    a11y_passed=false
  fi
  
  # Run axe-core accessibility tests via Cypress
  if ! npx cypress run --config-file tests/config/cypress.config.cjs --spec "tests/__tests__/accessibility/**/*.cy.js"; then
    test_log_error "Cypress accessibility tests failed"
    a11y_passed=false
  fi
  
  # Run Pa11y accessibility tests
  if command -v pa11y &> /dev/null; then
    test_log "Running Pa11y accessibility scan..."
    if ! pa11y http://localhost:3000 --reporter json > "$REPORTS_DIR/pa11y-report.json"; then
      test_log_error "Pa11y accessibility scan found issues"
      a11y_passed=false
    fi
  else
    test_log_warning "Pa11y not installed, skipping automated accessibility scan"
  fi
  
  if [[ "$a11y_passed" == true ]]; then
    test_log_success "Accessibility tests passed"
    return 0
  else
    test_log_error "Accessibility tests failed"
    return 1
  fi
}

run_performance_tests() {
  if [[ "$PERFORMANCE_TESTS" != true ]]; then
    return 0
  fi
  
  test_log "Running performance tests..."
  
  local perf_passed=true
  
  # Run Jest performance tests
  if ! npx jest --config=tests/config/jest.config.cjs --selectProjects=performance --testTimeout=300000; then
    test_log_error "Performance unit tests failed"
    perf_passed=false
  fi
  
  # Run Lighthouse CI
  if command -v lhci &> /dev/null; then
    test_log "Running Lighthouse CI performance audit..."
    if ! lhci autorun --config=tests/config/lighthouse.config.js; then
      test_log_error "Lighthouse performance audit failed"
      perf_passed=false
    fi
  else
    test_log_warning "Lighthouse CI not installed, skipping performance audit"
  fi
  
  # Run Artillery load tests
  if command -v artillery &> /dev/null; then
    test_log "Running Artillery load tests..."
    if ! artillery run tests/performance/load-test.yml --output "$REPORTS_DIR/artillery-report.json"; then
      test_log_error "Artillery load tests failed"
      perf_passed=false
    fi
  else
    test_log_warning "Artillery not installed, skipping load tests"
  fi
  
  if [[ "$perf_passed" == true ]]; then
    test_log_success "Performance tests passed"
    return 0
  else
    test_log_error "Performance tests failed"
    return 1
  fi
}

run_ai_tests() {
  if [[ "$AI_TESTS" != true ]]; then
    return 0
  fi
  
  test_log "Running AI tests..."
  
  if npx jest --config=tests/config/jest.config.cjs --selectProjects=ai --testTimeout=120000; then
    test_log_success "AI tests passed"
    return 0
  else
    test_log_error "AI tests failed"
    return 1
  fi
}

run_chaos_tests() {
  if [[ "$CHAOS_TESTS" != true ]]; then
    return 0
  fi
  
  test_log "Running chaos engineering tests..."
  test_log_warning "These tests may temporarily disrupt services"
  
  if npx jest --config=tests/config/jest.config.cjs --selectProjects=chaos --testTimeout=300000; then
    test_log_success "Chaos tests passed"
    return 0
  else
    test_log_error "Chaos tests failed"
    return 1
  fi
}

# Report generation
generate_reports() {
  test_log "Generating test reports..."
  
  # Merge coverage reports
  if [[ -d "$COVERAGE_DIR" ]]; then
    npx nyc merge "$COVERAGE_DIR" "$COVERAGE_DIR/merged-coverage.json"
    npx nyc report --reporter=html --reporter=lcov --temp-dir="$COVERAGE_DIR" --report-dir="$REPORTS_DIR/coverage"
  fi
  
  # Generate consolidated HTML report
  cat > "$REPORTS_DIR/test-summary.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>3 Ball Network Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .passed { color: green; }
        .failed { color: red; }
        .skipped { color: orange; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>3 Ball Network Test Results</h1>
    <p>Generated on: $(date)</p>
    
    <div class="section">
        <h2>Test Summary</h2>
        <ul>
            <li>Unit Tests: <span class="$([ "$UNIT_TESTS" == true ] && echo "passed" || echo "skipped")">$([ "$UNIT_TESTS" == true ] && echo "Executed" || echo "Skipped")</span></li>
            <li>Integration Tests: <span class="$([ "$INTEGRATION_TESTS" == true ] && echo "passed" || echo "skipped")">$([ "$INTEGRATION_TESTS" == true ] && echo "Executed" || echo "Skipped")</span></li>
            <li>E2E Tests: <span class="$([ "$E2E_TESTS" == true ] && echo "passed" || echo "skipped")">$([ "$E2E_TESTS" == true ] && echo "Executed" || echo "Skipped")</span></li>
            <li>Security Tests: <span class="$([ "$SECURITY_TESTS" == true ] && echo "passed" || echo "skipped")">$([ "$SECURITY_TESTS" == true ] && echo "Executed" || echo "Skipped")</span></li>
            <li>Accessibility Tests: <span class="$([ "$ACCESSIBILITY_TESTS" == true ] && echo "passed" || echo "skipped")">$([ "$ACCESSIBILITY_TESTS" == true ] && echo "Executed" || echo "Skipped")</span></li>
            <li>Performance Tests: <span class="$([ "$PERFORMANCE_TESTS" == true ] && echo "passed" || echo "skipped")">$([ "$PERFORMANCE_TESTS" == true ] && echo "Executed" || echo "Skipped")</span></li>
            <li>AI Tests: <span class="$([ "$AI_TESTS" == true ] && echo "passed" || echo "skipped")">$([ "$AI_TESTS" == true ] && echo "Executed" || echo "Skipped")</span></li>
            <li>Chaos Tests: <span class="$([ "$CHAOS_TESTS" == true ] && echo "passed" || echo "skipped")">$([ "$CHAOS_TESTS" == true ] && echo "Executed" || echo "Skipped")</span></li>
        </ul>
    </div>
    
    <div class="section">
        <h2>Coverage Reports</h2>
        <p><a href="coverage/index.html">View Coverage Report</a></p>
    </div>
    
    <div class="section">
        <h2>Individual Reports</h2>
        <ul>
            <li><a href="jest-report.html">Jest Test Results</a></li>
            <li><a href="cypress/reports/mochawesome.html">Cypress Test Results</a></li>
            <li><a href="lighthouse/index.html">Lighthouse Performance Report</a></li>
        </ul>
    </div>
</body>
</html>
EOF
  
  test_log_success "Reports generated in $REPORTS_DIR"
}

# Cleanup function
cleanup() {
  test_log "Cleaning up..."
  
  # Kill background processes
  if [[ -n "$DEV_SERVER_PID" ]]; then
    kill $DEV_SERVER_PID 2>/dev/null || true
  fi
  
  if [[ -n "$FIREBASE_PID" ]]; then
    kill $FIREBASE_PID 2>/dev/null || true
  fi
  
  # Reset environment
  unset NODE_ENV
  unset CI
  unset COVERAGE
}

# Main execution
main() {
  local start_time=$(date +%s)
  local failed_tests=()
  
  # Show beautiful header
  show_header
  
  test_log_section "🚀 Initializing comprehensive test suite..."
  echo ""
  
  # Setup
  setup_environment
  
  # Run tests with progress tracking
  local total_categories=8
  local current_category=0
  
  if [[ "$UNIT_TESTS" == true ]]; then
    ((current_category++))
    show_progress $current_category $total_categories "Unit Tests"
    echo ""
    if ! run_unit_tests; then
      failed_tests+=("Unit Tests")
    fi
  fi
  
  if [[ "$INTEGRATION_TESTS" == true ]]; then
    ((current_category++))
    show_progress $current_category $total_categories "Integration Tests"
    echo ""
    if ! run_integration_tests; then
      failed_tests+=("Integration Tests")
    fi
  fi
  
  if [[ "$E2E_TESTS" == true ]]; then
    ((current_category++))
    show_progress $current_category $total_categories "E2E Tests"
    echo ""
    if ! run_e2e_tests; then
      failed_tests+=("E2E Tests")
    fi
  fi
  
  if [[ "$SECURITY_TESTS" == true ]]; then
    ((current_category++))
    show_progress $current_category $total_categories "Security Tests"
    echo ""
    if ! run_security_tests; then
      failed_tests+=("Security Tests")
    fi
  fi
  
  if [[ "$ACCESSIBILITY_TESTS" == true ]]; then
    ((current_category++))
    show_progress $current_category $total_categories "Accessibility Tests"
    echo ""
    if ! run_accessibility_tests; then
      failed_tests+=("Accessibility Tests")
    fi
  fi
  
  if [[ "$PERFORMANCE_TESTS" == true ]]; then
    ((current_category++))
    show_progress $current_category $total_categories "Performance Tests"
    echo ""
    if ! run_performance_tests; then
      failed_tests+=("Performance Tests")
    fi
  fi
  
  if [[ "$AI_TESTS" == true ]]; then
    ((current_category++))
    show_progress $current_category $total_categories "AI Tests"
    echo ""
    if ! run_ai_tests; then
      failed_tests+=("AI Tests")
    fi
  fi
  
  if [[ "$CHAOS_TESTS" == true ]]; then
    ((current_category++))
    show_progress $current_category $total_categories "Chaos Tests"
    echo ""
    if ! run_chaos_tests; then
      failed_tests+=("Chaos Tests")
    fi
  fi
  
  # Generate beautiful HTML report
  echo ""
  generate_beautiful_report
  
  # Generate standard reports
  generate_reports
  
  # Summary
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))
  
  echo ""
  echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${PURPLE}║                     TEST EXECUTION SUMMARY                      ║${NC}"
  echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════╝${NC}"
  echo -e "${CYAN}⏱️  Duration: ${duration}s${NC}"
  echo ""
  
  if [[ ${#failed_tests[@]} -eq 0 ]]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Your 3 Ball Network is rock solid! 🏀${NC}"
    echo ""
    echo -e "${CYAN}📊 Interactive Dashboard: ${PROJECT_ROOT}/test-results-dashboard.html${NC}"
    echo -e "${CYAN}📁 Detailed Reports: ${REPORTS_DIR}/${NC}"
    cleanup
    exit 0
  else
    echo -e "${RED}❌ Some test suites encountered issues:${NC}"
    for test in "${failed_tests[@]}"; do
      echo -e "${RED}   • $test${NC}"
    done
    echo ""
    echo -e "${CYAN}📊 Interactive Dashboard: ${PROJECT_ROOT}/test-results-dashboard.html${NC}"
    echo -e "${CYAN}📁 Detailed Reports: ${REPORTS_DIR}/${NC}"
    cleanup
    exit 1
  fi
}

# Trap for cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"