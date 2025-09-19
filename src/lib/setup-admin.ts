import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface CreateAdminUserData {
  email: string;
  password: string;
  name: string;
}

export const createAdminUser = async (userData: CreateAdminUserData) => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;

    // Create user profile in Firestore with admin role
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: userData.email,
      name: userData.name,
      role: "admin",
      createdAt: new Date(),
      lastLogin: new Date(),
      createdBy: "system",
      status: "active"
    });

    console.log("Admin user created successfully:", {
      uid: user.uid,
      email: userData.email,
      name: userData.name
    });

    return {
      success: true,
      user: user,
      message: "Admin user created successfully"
    };
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    
    let errorMessage = "Failed to create admin user";
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "Email address is already in use";
        break;
      case 'auth/invalid-email':
        errorMessage = "Invalid email address";
        break;
      case 'auth/weak-password':
        errorMessage = "Password is too weak (minimum 6 characters)";
        break;
      default:
        errorMessage = error.message || "Unknown error occurred";
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// Helper function to check if any admin users exist
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    // This would require a more complex query in a real app
    // For now, we'll assume if we can't find any users, no admin exists
    return false;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    return false;
  }
};