# Troubleshooting Guide

## Current Issues and Solutions

### 1. Login Page Not Showing Content

**Problem:** Firebase Firestore permission errors preventing login page from loading user data.

**Solution:**
```bash
# Quick fix - deploy Firebase rules
npm run deploy-rules

# Or manually in Firebase Console:
# 1. Go to Firestore Database > Rules
# 2. Replace with the content from firestore.rules
# 3. Click Publish
```

### 2. Build Errors with .next Cache

**Problem:** Build cache corruption causing ENOENT errors.

**Solution:**
```bash
# Clear build cache
Remove-Item -Recurse -Force .next
npm run dev
```

### 3. Tailwind CSS Issues

**Problem:** CSS not loading or styling conflicts.

**Solution:** Already fixed with proper Tailwind v3 configuration.

### 4. Firebase Authentication Setup

**Steps to create admin user:**

1. **Deploy rules first** (see solution #1)

2. **Create admin user in Firestore:**
   - Go to Firebase Console > Firestore Database
   - Create collection: `users`
   - Add document with your user UID:
   ```json
   {
     "email": "admin@igtharvillage.com",
     "role": "admin", 
     "name": "Admin User",
     "createdAt": "2024-01-01T00:00:00.000Z",
     "lastLogin": "2024-01-01T00:00:00.000Z"
   }
   ```

3. **Create Firebase Auth user:**
   - Go to Authentication > Users
   - Add user with same email
   - Set password
   - Copy the UID and use it as document ID in step 2

### 5. Development Server Issues

**If dev server won't start:**
```bash
# Clear all caches
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache

# Reinstall dependencies
npm install

# Start dev server
npm run dev
```

### 6. Firebase CLI Setup

**If Firebase CLI issues:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Set project
firebase use ig-thar-village

# Deploy rules
firebase deploy --only firestore:rules,storage
```

## Quick Test Checklist

1. ✅ Firebase rules deployed
2. ✅ Admin user created in Firestore
3. ✅ Firebase Auth user created
4. ✅ Development server running
5. ✅ Can access /admin/login
6. ✅ Can login with admin credentials

## Emergency Temporary Fix

If you need immediate access for development:

1. Go to Firebase Console > Firestore > Rules
2. Use this temporary rule (DEVELOPMENT ONLY):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Remember to replace with proper rules later!

## Contact Information

If issues persist:
1. Check Firebase Console for error messages
2. Check browser console for JavaScript errors
3. Check server logs for detailed error information