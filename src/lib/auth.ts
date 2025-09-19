import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
  createdAt: Date;
  lastLogin: Date;
}

// Check if user has admin role
export const checkAdminRole = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === 'admin';
    }
    return false;
  } catch (error: any) {
    console.error("Error checking admin role:", error);
    
    // If it's a permission error, it might be due to Firestore rules not being set up
    if (error.code === 'permission-denied') {
      console.warn("Permission denied - please ensure Firestore security rules are deployed");
    }
    
    return false;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid,
        email: data.email,
        role: data.role,
        name: data.name,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate() || new Date()
      };
    }
    return null;
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    
    // If it's a permission error, it might be due to Firestore rules not being set up
    if (error.code === 'permission-denied') {
      console.warn("Permission denied - please ensure Firestore security rules are deployed");
    }
    
    return null;
  }
};

// Update user's last login time
export const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    await setDoc(doc(db, "users", uid), {
      lastLogin: new Date()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating last login:", error);
  }
};

// Admin login with role verification
export const adminLogin = async (email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  profile?: UserProfile;
  error?: string;
}> => {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user has admin role
    const isAdmin = await checkAdminRole(user.uid);
    
    if (!isAdmin) {
      // Sign out if not admin
      await firebaseSignOut(auth);
      return {
        success: false,
        error: "Access denied. Admin privileges required."
      };
    }

    // Get user profile
    const profile = await getUserProfile(user.uid);
    
    if (!profile) {
      await firebaseSignOut(auth);
      return {
        success: false,
        error: "User profile not found. Please contact administrator."
      };
    }

    // Update last login
    await updateLastLogin(user.uid);

    return {
      success: true,
      user,
      profile
    };
  } catch (error: any) {
    let errorMessage = "Login failed. Please try again.";
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = "No account found with this email address.";
        break;
      case 'auth/wrong-password':
        errorMessage = "Incorrect password. Please try again.";
        break;
      case 'auth/invalid-email':
        errorMessage = "Invalid email address format.";
        break;
      case 'auth/user-disabled':
        errorMessage = "This account has been disabled. Contact administrator.";
        break;
      case 'auth/too-many-requests':
        errorMessage = "Too many failed attempts. Please try again later.";
        break;
      default:
        errorMessage = "Login failed. Please check your credentials.";
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Auth state listener with role checking
export const onAuthStateChangedWithRole = (
  callback: (user: User | null, profile: UserProfile | null, isAdmin: boolean) => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      const isAdmin = profile?.role === 'admin' || false;
      callback(user, profile, isAdmin);
    } else {
      callback(null, null, false);
    }
  });
};