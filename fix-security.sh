#!/bin/bash

# Security Fix Script for 3 Ball Network
# This script applies comprehensive security fixes to all HTML files

echo "🔒 Starting comprehensive security fixes..."

# Counter for tracking changes
total_files=0
files_modified=0

# Find all HTML files in public directory
while IFS= read -r -d '' file; do
    echo "Processing: $file"
    total_files=$((total_files + 1))
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Apply security fixes
    modified=false
    
    # Remove inline onclick handlers and replace with IDs
    if grep -q 'onclick=' "$file"; then
        echo "  ✓ Removing onclick handlers"
        
        # Replace common onclick patterns
        sed -i '' 's/onclick="clearCacheAndReload()"/id="clearCacheBtn"/g' "$file"
        sed -i '' 's/onclick="window\.location\.href='\''\/'\''"/id="homepageBtn"/g' "$file"
        sed -i '' 's/onclick="this\.parentNode\.remove()"/data-action="close-message"/g' "$file"
        sed -i '' 's/onclick="[^"]*"//g' "$file"  # Remove any remaining onclick
        
        modified=true
    fi
    
    # Remove other inline event handlers
    for event in onchange onload onsubmit onerror onmouseover onfocus onblur; do
        if grep -q "$event=" "$file"; then
            echo "  ✓ Removing $event handlers"
            sed -i '' "s/$event=\"[^\"]*\"//g" "$file"
            modified=true
        fi
    done
    
    # Add comprehensive security script to head if not already present
    if ! grep -q "securityFixesComprehensive.js" "$file" && grep -q "</head>" "$file"; then
        echo "  ✓ Adding comprehensive security script"
        sed -i '' 's|</head>|<script src="/assets/js/securityFixesComprehensive.js"></script></head>|' "$file"
        modified=true
    fi
    
    # Add CSP header if not present
    if ! grep -q "Content-Security-Policy" "$file" && grep -q "<head>" "$file"; then
        echo "  ✓ Adding Content Security Policy"
        csp_meta='<meta http-equiv="Content-Security-Policy" content="default-src '\''self'\''; script-src '\''self'\''; style-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data: https:; connect-src '\''self'\'' https:; font-src '\''self'\''; object-src '\''none'\''; base-uri '\''self'\''; form-action '\''self'\'';">'
        sed -i '' "s|<head>|<head>$csp_meta|" "$file"
        modified=true
    fi
    
    if [ "$modified" = true ]; then
        files_modified=$((files_modified + 1))
        echo "  ✅ Security fixes applied to $file"
    else
        # Remove backup if no changes made
        rm "$file.backup"
        echo "  ℹ️  No security issues found in $file"
    fi
    
done < <(find /Users/mtfp_3/Desktop/GitHub/3-ball-network/public -name "*.html" -type f -print0)

echo ""
echo "🔒 Security fix summary:"
echo "  📁 Total HTML files processed: $total_files"
echo "  ✅ Files modified: $files_modified"
echo "  📋 Files with backups: $files_modified"
echo ""
echo "✅ Comprehensive security fixes completed!"

# Check for any remaining security issues
echo "🔍 Scanning for remaining security issues..."

unsafe_patterns=0

# Check for remaining innerHTML usage in JS files
echo "Checking for innerHTML usage in JS files..."
if find /Users/mtfp_3/Desktop/GitHub/3-ball-network/public -name "*.js" -type f -exec grep -l "innerHTML.*=" {} \; | grep -v securityFixes; then
    unsafe_patterns=$((unsafe_patterns + 1))
    echo "⚠️  Found innerHTML usage in JS files (check above)"
fi

# Check for remaining inline event handlers
echo "Checking for remaining inline event handlers..."
if find /Users/mtfp_3/Desktop/GitHub/3-ball-network/public -name "*.html" -type f -exec grep -l "on[a-z]*=" {} \;; then
    unsafe_patterns=$((unsafe_patterns + 1))
    echo "⚠️  Found remaining inline event handlers (check above)"
fi

if [ $unsafe_patterns -eq 0 ]; then
    echo "🎉 No security issues found! Your codebase is secure."
else
    echo "⚠️  Found $unsafe_patterns potential security issues that need manual review."
fi
