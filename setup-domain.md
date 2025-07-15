# Custom Domain Setup Guide for 3ballnetwork.com

## 📋 Prerequisites

- Your domain `3ballnetwork.com` must be registered and you must have access to DNS settings
- Firebase project is already set up and deployed

## 🔧 Steps to Set Up Custom Domain

### 1. Add Custom Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/ball-network-web/hosting/sites)
2. Click on your hosting site `ball-network-web`
3. Click "Add custom domain"
4. Enter `3ballnetwork.com`
5. Click "Continue"

### 2. Verify Domain Ownership

Firebase will provide you with a TXT record to add to your DNS:

```
Name: 3ballnetwork.com
Type: TXT
Value: [Firebase will provide this]
```

Add this TXT record to your domain's DNS settings through your domain provider.

### 3. Configure DNS Records

After verification, Firebase will provide DNS records to point your domain to Firebase Hosting:

**For Apex Domain (3ballnetwork.com):**

```
Type: A
Name: @
Value: 199.36.158.100
```

**For WWW Subdomain (optional):**

```
Type: CNAME
Name: www
Value: 3ballnetwork.com
```

### 4. SSL Certificate

Firebase will automatically provision and manage SSL certificates for your custom domain.

## ✅ Expected Results

Once setup is complete:

- `https://3ballnetwork.com` → Your main website
- `https://3ballnetwork.com/admin` → Admin portal
- `https://3ballnetwork.com/demo-player` → Player demo
- `https://3ballnetwork.com/demo-coach` → Coach demo
- `https://3ballnetwork.com/demo-fan` → Fan demo
- `https://3ballnetwork.com/demo-scout` → Scout demo

## 🔄 Automatic Redirects

The firebase.json configuration includes redirects from the Firebase default domain to your custom domain.

## ⏱ Propagation Time

- DNS changes can take up to 24-48 hours to fully propagate
- SSL certificate provisioning typically takes 15-60 minutes

## 🛠 Troubleshooting

- Check DNS propagation with: `dig 3ballnetwork.com`
- Verify SSL with: `openssl s_client -connect 3ballnetwork.com:443`
- Firebase Console will show domain status and any issues

## 📞 Need Help?

- Firebase Hosting documentation: https://firebase.google.com/docs/hosting
- Domain setup guide: https://firebase.google.com/docs/hosting/custom-domain
