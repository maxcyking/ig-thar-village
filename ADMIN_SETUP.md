# Admin Setup Guide - IG Thar Village

This guide will help you set up the first admin user for the IG Thar Village admin panel.

## 🔐 Security Overview

The admin system uses Firebase Authentication with role-based access control:
- Users are authenticated via Firebase Auth
- User profiles are stored in Firestore with role information
- Only users with `role: "admin"` can access the admin panel
- All admin actions are logged and monitored

## 📋 Prerequisites

1. **Firebase Project Setup**
   - Firebase project created and configured
   - Firestore database enabled
   - Authentication enabled (Email/Password provider)
   - Environment variables configured in `.env.local`

2. **Firestore Collections**
   The following collection will be created automatically:
   ```
   users/
   ├── {userId}/
   │   ├── uid: string
   │   ├── email: string
   │   ├── name: string
   │   ├── role: "admin" | "user"
   │   ├── createdAt: timestamp
   │   ├── lastLogin: timestamp
   │   ├── createdBy: string
   │   └── status: "active" | "inactive"
   ```

## 🚀 Creating the First Admin User

### Method 1: Using Firebase Console (Recommended)

1. **Create User in Firebase Auth**
   - Go to Firebase Console > Authentication > Users
   - Click "Add user"
   - Enter email: `admin@igtharvillage.com`
   - Enter a secure password (minimum 8 characters)
   - Click "Add user"

2. **Create User Profile in Firestore**
   - Go to Firebase Console > Firestore Database
   - Create a new collection called `users`
   - Add a document with the User UID as the document ID
   - Add the following fields:
     ```json
     {
       "uid": "user-uid-from-auth",
       "email": "admin@igtharvillage.com",
       "name": "Admin User",
       "role": "admin",
       "createdAt": "2024-01-01T00:00:00.000Z",
       "lastLogin": "2024-01-01T00:00:00.000Z",
       "createdBy": "system",
       "status": "active"
     }
     ```

### Method 2: Using Firebase CLI

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Create Admin User Script**
   Create a file `scripts/create-admin.js`:
   ```javascript
   const admin = require('firebase-admin');
   
   // Initialize Firebase Admin
   const serviceAccount = require('./path-to-service-account-key.json');
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   
   const auth = admin.auth();
   const firestore = admin.firestore();
   
   async function createAdminUser() {
     try {
       // Create user
       const userRecord = await auth.createUser({
         email: 'admin@igtharvillage.com',
         password: 'SecurePassword123!',
         displayName: 'Admin User'
       });
   
       // Create user profile
       await firestore.collection('users').doc(userRecord.uid).set({
         uid: userRecord.uid,
         email: 'admin@igtharvillage.com',
         name: 'Admin User',
         role: 'admin',
         createdAt: admin.firestore.FieldValue.serverTimestamp(),
         lastLogin: admin.firestore.FieldValue.serverTimestamp(),
         createdBy: 'system',
         status: 'active'
       });
   
       console.log('Admin user created successfully:', userRecord.uid);
     } catch (error) {
       console.error('Error creating admin user:', error);
     }
   }
   
   createAdminUser();
   ```

4. **Run the Script**
   ```bash
   node scripts/create-admin.js
   ```

### Method 3: Using the Application (Development Only)

For development purposes, you can create a temporary setup page:

1. **Create Setup Page** (`src/app/setup/page.tsx`):
   ```typescript
   "use client";
   
   import { useState } from "react";
   import { createAdminUser } from "@/lib/setup-admin";
   
   export default function SetupPage() {
     const [formData, setFormData] = useState({
       email: "admin@igtharvillage.com",
       password: "",
       name: "Admin User"
     });
     const [loading, setLoading] = useState(false);
     const [result, setResult] = useState<any>(null);
   
     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       setLoading(true);
       
       const result = await createAdminUser(formData);
       setResult(result);
       setLoading(false);
     };
   
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
         <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
           <h1 className="text-2xl font-bold mb-6">Create Admin User</h1>
           
           <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">Name</label>
               <input
                 type="text"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="w-full p-2 border rounded"
                 required
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1">Email</label>
               <input
                 type="email"
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 className="w-full p-2 border rounded"
                 required
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1">Password</label>
               <input
                 type="password"
                 value={formData.password}
                 onChange={(e) => setFormData({...formData, password: e.target.value})}
                 className="w-full p-2 border rounded"
                 required
                 minLength={6}
               />
             </div>
             
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
             >
               {loading ? "Creating..." : "Create Admin User"}
             </button>
           </form>
           
           {result && (
             <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
               {result.success ? result.message : result.error}
             </div>
           )}
         </div>
       </div>
     );
   }
   ```

2. **Access Setup Page**
   - Go to `http://localhost:3000/setup`
   - Fill in the admin user details
   - Click "Create Admin User"
   - **Important**: Delete this page after creating the admin user!

## 🔒 Security Best Practices

1. **Strong Password Policy**
   - Minimum 8 characters
   - Include uppercase, lowercase, numbers, and symbols
   - Avoid common passwords or personal information

2. **Email Security**
   - Use a dedicated admin email address
   - Enable 2FA on the email account
   - Monitor for suspicious login attempts

3. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection - only authenticated users can read their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         // Allow admins to read all user data
         allow read: if request.auth != null && 
           exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // Other collections - admin only
       match /{document=**} {
         allow read, write: if request.auth != null && 
           exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

4. **Environment Variables**
   - Keep Firebase config in environment variables
   - Never commit sensitive keys to version control
   - Use different Firebase projects for development and production

## 🧪 Testing Admin Access

1. **Test Login**
   - Go to `http://localhost:3000/admin/login`
   - Enter admin credentials
   - Verify successful login and redirect to dashboard

2. **Test Role Verification**
   - Try logging in with a non-admin user
   - Verify access is denied
   - Check error messages are appropriate

3. **Test Admin Functions**
   - Navigate through admin sections
   - Test CRUD operations
   - Verify data persistence

## 🚨 Troubleshooting

### Common Issues

1. **"Access Denied" Error**
   - Check user role in Firestore
   - Verify user document exists
   - Ensure role field is exactly "admin"

2. **Login Failed**
   - Check Firebase Auth configuration
   - Verify email/password in Firebase Console
   - Check browser console for errors

3. **Firestore Permission Denied**
   - Update Firestore security rules
   - Check user authentication status
   - Verify admin role in user document

### Debug Steps

1. **Check Firebase Configuration**
   ```bash
   # Verify environment variables
   echo $NEXT_PUBLIC_FIREBASE_API_KEY
   ```

2. **Check User Data**
   - Go to Firebase Console > Firestore
   - Find user document by UID
   - Verify role field is "admin"

3. **Check Browser Console**
   - Open Developer Tools
   - Look for authentication errors
   - Check network requests to Firebase

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Firebase configuration
3. Review browser console errors
4. Contact the development team

---

**Security Note**: Always delete any setup pages or scripts after creating the admin user. Never expose admin creation functionality in production.