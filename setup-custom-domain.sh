#!/bin/bash

echo "🌐 3 Ball Network - Custom Domain Setup Assistant"
echo "================================================="
echo ""
echo "This script will help you set up 3ballnetwork.com with Firebase Hosting"
echo ""

# Check if user has domain access
echo "❓ Do you have access to manage DNS for 3ballnetwork.com? (y/n)"
read -r has_domain_access

if [[ "$has_domain_access" != "y" ]]; then
    echo "❌ You need DNS management access for 3ballnetwork.com to proceed."
    echo "   Contact your domain provider or administrator."
    exit 1
fi

echo ""
echo "🔍 Let's identify your domain provider..."
echo "Where is 3ballnetwork.com registered?"
echo "1) GoDaddy"
echo "2) Namecheap" 
echo "3) Cloudflare"
echo "4) Google Domains"
echo "5) AWS Route 53"
echo "6) Other"
echo ""
echo "Enter choice (1-6):"
read -r provider_choice

case $provider_choice in
    1)
        provider="GoDaddy"
        dns_instructions="
🔧 GoDaddy DNS Setup:
1. Log into your GoDaddy account
2. Go to 'My Products' > 'DNS'
3. Find 3ballnetwork.com and click 'DNS'
4. Add the TXT record provided by Firebase
5. Add the A record: @ → 199.36.158.100
6. Save changes
"
        ;;
    2)
        provider="Namecheap"
        dns_instructions="
🔧 Namecheap DNS Setup:
1. Log into your Namecheap account
2. Go to 'Domain List' > 'Manage' for 3ballnetwork.com
3. Click 'Advanced DNS' tab
4. Add the TXT record provided by Firebase
5. Add A record: @ → 199.36.158.100
6. Save all changes
"
        ;;
    3)
        provider="Cloudflare"
        dns_instructions="
🔧 Cloudflare DNS Setup:
1. Log into your Cloudflare dashboard
2. Select 3ballnetwork.com domain
3. Go to 'DNS' > 'Records'
4. Add the TXT record provided by Firebase
5. Add A record: @ → 199.36.158.100
6. Ensure proxy is disabled (gray cloud) for Firebase hosting
"
        ;;
    4)
        provider="Google Domains"
        dns_instructions="
🔧 Google Domains DNS Setup:
1. Go to domains.google.com
2. Find 3ballnetwork.com and click 'Manage'
3. Go to 'DNS' tab
4. Add the TXT record provided by Firebase
5. Add A record: @ → 199.36.158.100
6. Save changes
"
        ;;
    5)
        provider="AWS Route 53"
        dns_instructions="
🔧 AWS Route 53 DNS Setup:
1. Log into AWS Console
2. Go to Route 53 > Hosted Zones
3. Select 3ballnetwork.com
4. Create Record: TXT record from Firebase
5. Create Record: A record @ → 199.36.158.100
6. Save record set
"
        ;;
    *)
        provider="Your Domain Provider"
        dns_instructions="
🔧 Generic DNS Setup:
1. Log into your domain provider's control panel
2. Navigate to DNS management for 3ballnetwork.com
3. Add the TXT record provided by Firebase for verification
4. Add an A record: @ pointing to 199.36.158.100
5. Save all DNS changes
"
        ;;
esac

echo ""
echo "📋 Setup Instructions for $provider:"
echo "$dns_instructions"
echo ""

echo "🚀 Next Steps:"
echo "1. Open Firebase Console: https://console.firebase.google.com/project/ball-network-web/hosting/sites"
echo "2. Click 'Add custom domain'"
echo "3. Enter: 3ballnetwork.com"
echo "4. Follow Firebase's verification steps"
echo "5. Add the DNS records as shown above"
echo "6. Wait for propagation (up to 24-48 hours)"
echo ""

echo "✅ Once complete, your site will be available at:"
echo "   • https://3ballnetwork.com"
echo "   • https://3ballnetwork.com/admin"
echo "   • https://3ballnetwork.com/demo-player.html"
echo "   • https://3ballnetwork.com/demo-coach.html"
echo "   • https://3ballnetwork.com/demo-fan.html"
echo "   • https://3ballnetwork.com/demo-scout.html"
echo ""

echo "🔄 Firebase will automatically:"
echo "   • Provision SSL certificates"
echo "   • Redirect from ball-network-web.web.app to 3ballnetwork.com"
echo "   • Handle www redirects"
echo ""

echo "📖 For detailed instructions, see: setup-domain.md"
echo ""
echo "🎉 Good luck with your custom domain setup!"
