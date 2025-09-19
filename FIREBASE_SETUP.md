# Firebase Setup Guide

## The Issue
The login page content is not showing because Firebase Firestore security rules are blocking access to user data. The error "Missing or insufficient permissions" indicates that the default Firestore rules are too restrictive.

## Quick Fix (Temporary - for development only)

### Option 1: Temporary Open Rules (Development Only)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `ig-thar-village`
3. Go to Firestore Database > Rules
4. Replace the rules with this temporary version:

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

5. Click "Publish"

**⚠️ WARNING: This allows any authenticated user to read/write all data. Use only for development!**

## Proper Setup (Production Ready)

### Step 1: Deploy Security Rules
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init` (select Firestore and Storage)
4. Deploy rules: `firebase deploy --only firestore:rules,storage`

### Step 2: Create Admin User
1. Run the setup script: `npm run setup-admin` (if available)
2. Or manually create an admin user in Firestore:
   - Collection: `users`
   - Document ID: `[user-uid]`
   - Data:
     ```json
     {
       "email": "admin@igtharvillage.com",
       "role": "admin",
       "name": "Admin User",
       "createdAt": "2024-01-01T00:00:00Z",
       "lastLogin": "2024-01-01T00:00:00Z"
     }
     ```

### Step 3: Test Login
1. Start the development server: `npm run dev`
2. Go to `/admin/login`
3. Login with your admin credentials

## Files Created
- `firestore.rules` - Firestore security rules
- `storage.rules` - Storage security rules  
- `firebase.json` - Firebase configuration
- `firestore.indexes.json` - Database indexes

## Security Features
- Public read access to products, blogs, gallery, media
- Admin-only write access to all collections
- Users can read their own profile data
- Contact form submissions allowed from anyone
- Proper role-based access control