# Deployment Guide - IG Thar Village

## 🚀 Quick Deployment Checklist

### 1. Pre-deployment Setup
- [ ] Firebase project created and configured
- [ ] Environment variables set
- [ ] Admin user account created in Firebase Auth
- [ ] Firestore collections initialized
- [ ] Storage bucket configured

### 2. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it "ig-thar-village" or similar
4. Enable Google Analytics (optional)

#### Enable Authentication
```bash
# In Firebase Console:
# 1. Go to Authentication > Sign-in method
# 2. Enable "Email/Password"
# 3. Create admin user:
#    Email: admin@igtharvillage.com
#    Password: [secure-password]
```

#### Setup Firestore Database
```javascript
// Collections to create:
- products/
- blogs/
- bookings/
- messages/
- media/
- analytics/
```

#### Configure Storage
```javascript
// Storage rules (Firebase Console > Storage > Rules):
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Environment Variables

Create `.env.local` file:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ig-thar-village.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ig-thar-village
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ig-thar-village.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4. Vercel Deployment (Recommended)

#### Method 1: GitHub Integration
1. Push code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Deploy

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... add all other env vars

# Deploy to production
vercel --prod
```

### 5. Alternative Deployment Options

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
# Add all NEXT_PUBLIC_* variables in Netlify dashboard
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Add environment variables
5. Deploy

### 6. Domain Configuration

#### Custom Domain Setup
1. Purchase domain (e.g., igtharvillage.com)
2. In Vercel/Netlify dashboard:
   - Go to Domains section
   - Add custom domain
   - Configure DNS records:
     ```
     Type: CNAME
     Name: www
     Value: your-app.vercel.app
     
     Type: A
     Name: @
     Value: [Platform IP]
     ```

#### SSL Certificate
- Automatic with Vercel/Netlify
- Let's Encrypt certificate
- HTTPS redirect enabled

### 7. Post-Deployment Tasks

#### Test Admin Access
1. Go to `https://yourdomain.com/admin/login`
2. Login with admin credentials
3. Test all admin functions

#### Setup Analytics
```javascript
// Add to src/lib/analytics.ts
import { getAnalytics } from "firebase/analytics";
import { app } from "./firebase";

export const analytics = getAnalytics(app);
```

#### Configure SEO
```javascript
// Update src/app/layout.tsx metadata
export const metadata = {
  title: "IG Thar Village - Authentic Desert Experience",
  description: "Experience authentic desert culture...",
  keywords: "Thar Desert, Rajasthan, Farm Stay...",
  openGraph: {
    title: "IG Thar Village",
    description: "Authentic desert experiences...",
    url: "https://igtharvillage.com",
    images: ["/og-image.jpg"]
  }
};
```

### 8. Performance Optimization

#### Image Optimization
```bash
# Add to next.config.ts
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

#### Caching Strategy
```javascript
// Add to src/app/layout.tsx
export const revalidate = 3600; // 1 hour
```

### 9. Monitoring & Analytics

#### Setup Error Tracking
```bash
# Install Sentry (optional)
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

#### Performance Monitoring
- Use Vercel Analytics
- Google PageSpeed Insights
- Firebase Performance Monitoring

### 10. Backup Strategy

#### Database Backup
```bash
# Firebase CLI backup
firebase firestore:export gs://your-bucket/backups/$(date +%Y%m%d)
```

#### Code Backup
- GitHub repository (primary)
- Regular commits and tags
- Release branches for production

### 11. Security Checklist

- [ ] Environment variables secured
- [ ] Firebase security rules configured
- [ ] HTTPS enabled
- [ ] Admin routes protected
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] CSRF protection active

### 12. Launch Checklist

- [ ] All pages load correctly
- [ ] Contact forms working
- [ ] Admin panel accessible
- [ ] Product management functional
- [ ] Blog system operational
- [ ] Media uploads working
- [ ] Mobile responsive
- [ ] SEO optimized
- [ ] Analytics tracking
- [ ] Error monitoring active

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Firebase Connection Issues
```bash
# Check environment variables
echo $NEXT_PUBLIC_FIREBASE_API_KEY

# Verify Firebase config
npm run dev
# Check browser console for errors
```

#### Deployment Failures
```bash
# Check build logs
vercel logs [deployment-url]

# Test local build
npm run build
npm start
```

### Support Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Ready to launch your authentic desert experience platform! 🏜️**