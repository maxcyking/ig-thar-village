import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

// Testimonial Types
export interface Testimonial {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userLocation?: string;
  rating: number; // 1-5 stars
  title: string;
  message: string;
  experience?: string; // e.g., "Farm Stay Experience", "Desert Safari"
  images?: string[]; // Optional images uploaded by user
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  visible: boolean;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

// Get all testimonials (for public display)
export const getTestimonials = async (featured?: boolean, limit_count?: number): Promise<Testimonial[]> => {
  try {
    let q = query(
      collection(db, "testimonials"),
      where("status", "==", "approved"),
      where("visible", "==", true),
      orderBy("createdAt", "desc")
    );

    if (featured) {
      q = query(
        collection(db, "testimonials"),
        where("status", "==", "approved"),
        where("visible", "==", true),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(limit_count || 6)
      );
    } else if (limit_count) {
      q = query(
        collection(db, "testimonials"),
        where("status", "==", "approved"),
        where("visible", "==", true),
        orderBy("createdAt", "desc"),
        limit(limit_count)
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      approvedAt: doc.data().approvedAt?.toDate() || null,
    })) as Testimonial[];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};

// Get all testimonials (for admin panel)
export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const q = query(
      collection(db, "testimonials"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      approvedAt: doc.data().approvedAt?.toDate() || null,
    })) as Testimonial[];
  } catch (error) {
    console.error("Error fetching all testimonials:", error);
    return [];
  }
};

// Get testimonials by user
export const getUserTestimonials = async (userId: string): Promise<Testimonial[]> => {
  try {
    const q = query(
      collection(db, "testimonials"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      approvedAt: doc.data().approvedAt?.toDate() || null,
    })) as Testimonial[];
  } catch (error) {
    console.error("Error fetching user testimonials:", error);
    return [];
  }
};

// Get single testimonial
export const getTestimonial = async (id: string): Promise<Testimonial | null> => {
  try {
    const docRef = doc(db, "testimonials", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        approvedAt: docSnap.data().approvedAt?.toDate() || null,
      } as Testimonial;
    }
    return null;
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return null;
  }
};

// Create testimonial
export const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt' | 'approvedAt' | 'approvedBy'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "testimonials"), {
      ...testimonialData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
};

// Update testimonial
export const updateTestimonial = async (id: string, testimonialData: Partial<Testimonial>): Promise<void> => {
  try {
    const docRef = doc(db, "testimonials", id);
    const updateData: any = {
      ...testimonialData,
      updatedAt: Timestamp.now(),
    };

    // Handle approvedAt timestamp
    if (testimonialData.status === 'approved' && !testimonialData.approvedAt) {
      updateData.approvedAt = Timestamp.now();
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

// Delete testimonial
export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "testimonials", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
};

// Get testimonial statistics
export const getTestimonialStats = async () => {
  try {
    const allTestimonials = await getAllTestimonials();
    
    const stats = {
      total: allTestimonials.length,
      approved: allTestimonials.filter(t => t.status === 'approved').length,
      pending: allTestimonials.filter(t => t.status === 'pending').length,
      rejected: allTestimonials.filter(t => t.status === 'rejected').length,
      featured: allTestimonials.filter(t => t.featured).length,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    const approvedTestimonials = allTestimonials.filter(t => t.status === 'approved');
    
    if (approvedTestimonials.length > 0) {
      const totalRating = approvedTestimonials.reduce((sum, t) => sum + t.rating, 0);
      stats.averageRating = totalRating / approvedTestimonials.length;
      
      approvedTestimonials.forEach(t => {
        stats.ratingDistribution[t.rating as keyof typeof stats.ratingDistribution]++;
      });
    }

    return stats;
  } catch (error) {
    console.error("Error fetching testimonial stats:", error);
    return {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      featured: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
};