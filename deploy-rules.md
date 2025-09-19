# Deploy Firebase Security Rules

## Prerequisites
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init`

## Deploy Security Rules

### Option 1: Deploy All Rules
```bash
firebase deploy
```

### Option 2: Deploy Only Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Option 3: Deploy Only Storage Rules
```bash
firebase deploy --only storage
```

## Manual Setup (Alternative)

If you prefer to set up rules manually in the Firebase Console:

### Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `ig-thar-village`
3. Go to Firestore Database > Rules
4. Copy and paste the content from `firestore.rules`
5. Click "Publish"

### Storage Rules
1. Go to Storage > Rules
2. Copy and paste the content from `storage.rules`
3. Click "Publish"

## Important Notes

- These rules allow public read access to products, blogs, gallery, and media
- Only authenticated admin users can write/modify data
- Users can read their own profile data
- Contact form submissions are allowed from anyone
- All admin operations require the user to have `role: 'admin'` in their user document

## Testing Rules

After deploying, test the rules by:
1. Trying to access the login page (should work now)
2. Creating an admin user using the setup script
3. Testing login functionality
4. Verifying admin operations work correctly