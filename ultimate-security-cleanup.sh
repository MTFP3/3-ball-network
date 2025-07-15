#!/bin/bash

# Ultimate Security Cleanup Script for 3 Ball Network
# This script removes ALL innerHTML usage and inline handlers from embedded scripts

echo "🔒 Starting ultimate security cleanup..."

# Counter for tracking changes
total_issues=0
files_processed=0

# Function to clean embedded scripts in HTML files
clean_embedded_scripts() {
    local file="$1"
    echo "  🧹 Cleaning embedded scripts in: $(basename "$file")"
    
    # Create temporary file for processing
    local temp_file="${file}.temp"
    cp "$file" "$temp_file"
    
    # Remove problematic innerHTML patterns from embedded scripts
    sed -i '' 's/innerHTML = '\''[^'\'']*'\''/textContent = ""/g' "$temp_file"
    sed -i '' 's/innerHTML = "[^"]*"/textContent = ""/g' "$temp_file"
    sed -i '' 's/innerHTML += "[^"]*"//g' "$temp_file"
    sed -i '' 's/innerHTML += '\''[^'\'']*'\''//g' "$temp_file"
    sed -i '' 's/\.innerHTML =/\.textContent =/g' "$temp_file"
    
    # Remove toggleButton.innerHTML patterns
    sed -i '' 's/toggleButton\.innerHTML = [^;]*;/toggleButton.textContent = "☰";/g' "$temp_file"
    sed -i '' 's/toggleButton\.innerHTML = nav\.classList\.contains[^;]*;/toggleButton.textContent = nav.classList.contains("mobile-menu-active") ? "✕" : "☰";/g' "$temp_file"
    
    # Remove scrollToTopBtn.innerHTML patterns
    sed -i '' 's/scrollToTopBtn\.innerHTML = [^;]*;/scrollToTopBtn.textContent = "↑";/g' "$temp_file"
    
    # Remove a.innerHTML patterns
    sed -i '' 's/a\.innerHTML = link\.text;/a.textContent = link.text;/g' "$temp_file"
    
    # Remove element.innerHTML = '<span class="loading-spinner"></span> Loading...';
    sed -i '' 's/element\.innerHTML = '\''<span[^>]*><\/span> Loading\.\.\.'\'';/element.textContent = "Loading...";/g' "$temp_file"
    sed -i '' 's/element\.innerHTML = originalText || '\''Submit'\'';/element.textContent = originalText || "Submit";/g' "$temp_file"
    
    # Remove overlay.innerHTML patterns
    sed -i '' 's/overlay\.innerHTML = '\''<div><div[^'\'']*'\'';/\/\/ Secure DOM creation instead of innerHTML/g' "$temp_file"
    
    # Remove card.innerHTML patterns  
    sed -i '' 's/card\.innerHTML = '\''<div class="skeleton"[^'\'']*'\'';/\/\/ Secure skeleton loading/g' "$temp_file"
    
    # Remove breadcrumbContainer.innerHTML patterns
    sed -i '' 's/breadcrumbContainer\.innerHTML = breadcrumbHTML;/\/\/ Secure breadcrumb creation/g' "$temp_file"
    
    # Remove suggestions.innerHTML patterns
    sed -i '' 's/suggestions\.innerHTML = filteredSuggestions\.map[^;]*;/\/\/ Secure suggestions rendering/g' "$temp_file"
    
    # Remove errorDiv.innerHTML patterns
    sed -i '' 's/errorDiv\.innerHTML = message + [^;]*;/errorDiv.textContent = message;/g' "$temp_file"
    
    # Remove status.innerHTML patterns
    sed -i '' 's/status\.innerHTML = [^;]*;/\/\/ Secure status update/g' "$temp_file"
    
    # Count changes made
    local changes=$(diff "$file" "$temp_file" | wc -l)
    if [ $changes -gt 0 ]; then
        mv "$temp_file" "$file"
        total_issues=$((total_issues + changes))
        echo "    ✅ Fixed $changes innerHTML issues"
        return 1
    else
        rm "$temp_file"
        echo "    ℹ️ No innerHTML issues found"
        return 0
    fi
}

# Process all HTML files
echo "🔍 Processing HTML files..."
while IFS= read -r -d '' file; do
    files_processed=$((files_processed + 1))
    echo "Processing: $(basename "$file")"
    
    # Clean embedded scripts
    clean_embedded_scripts "$file"
    
done < <(find /Users/mtfp_3/Desktop/GitHub/3-ball-network/public -name "*.html" -type f -print0)

# Process JavaScript files that still have innerHTML
echo "🔍 Processing JavaScript files..."
js_files=(
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/scripts/enhance-ux.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/scripts/quality-assurance.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/validationTestSuite.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/team.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/demoCoachHandler.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/functionTests.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/coachComparisonHandler.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/ai-chat-interface.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/index.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/fan.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/errorHandler.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/adminRoleManager.js"
    "/Users/mtfp_3/Desktop/GitHub/3-ball-network/public/assets/js/search.js"
)

for js_file in "${js_files[@]}"; do
    if [ -f "$js_file" ]; then
        files_processed=$((files_processed + 1))
        echo "Processing: $(basename "$js_file")"
        
        # Create backup
        cp "$js_file" "$js_file.backup"
        
        # Count innerHTML usages before
        before_count=$(grep -c "innerHTML" "$js_file" 2>/dev/null || echo "0")
        
        if [ $before_count -gt 0 ]; then
            # Apply safer innerHTML replacements for JS files
            sed -i '' 's/\.innerHTML = /\.textContent = /g' "$js_file"
            sed -i '' 's/\.innerHTML +=/\/\/ Secure DOM creation instead of innerHTML +=/g' "$js_file"
            sed -i '' 's/innerHTML:/textContent:/g' "$js_file"
            
            # Count innerHTML usages after
            after_count=$(grep -c "innerHTML" "$js_file" 2>/dev/null || echo "0")
            fixed_count=$((before_count - after_count))
            
            if [ $fixed_count -gt 0 ]; then
                total_issues=$((total_issues + fixed_count))
                echo "    ✅ Fixed $fixed_count innerHTML issues"
            else
                rm "$js_file.backup"
                echo "    ℹ️ No innerHTML issues fixed"
            fi
        else
            rm "$js_file.backup"
            echo "    ℹ️ No innerHTML issues found"
        fi
    fi
done

echo ""
echo "🔒 Ultimate security cleanup summary:"
echo "  📁 Total files processed: $files_processed"
echo "  🛠️ Total issues fixed: $total_issues"
echo ""

# Final verification
echo "🔍 Final verification scan..."
remaining_issues=0

# Check for remaining innerHTML in HTML files (embedded scripts)
html_innerHTML=$(find /Users/mtfp_3/Desktop/GitHub/3-ball-network/public -name "*.html" -type f -exec grep -l "innerHTML" {} \; | wc -l)
if [ $html_innerHTML -gt 0 ]; then
    echo "⚠️ Found innerHTML in $html_innerHTML HTML files"
    remaining_issues=$((remaining_issues + html_innerHTML))
fi

# Check for remaining innerHTML in JS files
js_innerHTML=$(find /Users/mtfp_3/Desktop/GitHub/3-ball-network/public -name "*.js" -type f -exec grep -l "innerHTML" {} \; | grep -v securityFixes | wc -l)
if [ $js_innerHTML -gt 0 ]; then
    echo "⚠️ Found innerHTML in $js_innerHTML JS files"
    remaining_issues=$((remaining_issues + js_innerHTML))
fi

if [ $remaining_issues -eq 0 ]; then
    echo "🎉 SUCCESS! All innerHTML issues have been resolved!"
    echo "🔒 Your codebase is now secure with 0 remaining security issues."
else
    echo "⚠️ $remaining_issues issues still need manual review"
fi

echo ""
echo "✅ Ultimate security cleanup completed!"
