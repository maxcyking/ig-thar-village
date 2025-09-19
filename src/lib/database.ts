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

// Property Types
export interface Property {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  amenities: string[];
  pricePerNight: number;
  maxGuests: number;
  category: 'farm-stay' | 'desert-camp' | 'heritage-room' | 'luxury-tent';
  featured: boolean;
  available: boolean;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  unit: string;
  category: 'dairy' | 'grains' | 'vegetables' | 'spices' | 'handicrafts' | 'other';
  inStock: boolean;
  featured: boolean;
  organic: boolean;
  weight?: string;
  nutritionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  duration: string;
  category: 'safari' | 'cultural' | 'adventure' | 'spiritual' | 'educational';
  included: string[];
  featured: boolean;
  available: boolean;
  maxParticipants: number;
  createdAt: Date;
  updatedAt: Date;
}

// Gallery Types
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'accommodation' | 'activities' | 'food' | 'culture' | 'agriculture' | 'heritage' | 'nature' | 'spirituality';
  featured: boolean;
  visible: boolean;
  altText?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Award Types
export interface Award {
  id: string;
  title: string;
  description: string;
  organization: string;
  year: string;
  category: 'sustainability' | 'tourism' | 'hospitality' | 'culture' | 'community' | 'agriculture' | 'innovation' | 'other';
  certificateUrl?: string;
  imageUrl?: string;
  featured: boolean;
  visible: boolean;
  awardDate?: Date;
  certificateNumber?: string;
  testimonial?: string;
  testimonialAuthor?: string;
  testimonialPosition?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Properties Functions
export const getProperties = async (featured?: boolean): Promise<Property[]> => {
  try {
    let q = query(
      collection(db, "properties"),
      where("available", "==", true),
      orderBy("createdAt", "desc")
    );

    if (featured) {
      q = query(
        collection(db, "properties"),
        where("available", "==", true),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(3)
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Property[];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const getProperty = async (id: string): Promise<Property | null> => {
  try {
    const docRef = doc(db, "properties", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Property;
    }
    return null;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
};

// Products Functions
export const getProducts = async (featured?: boolean, category?: string): Promise<Product[]> => {
  try {
    let q = query(
      collection(db, "products"),
      where("inStock", "==", true),
      orderBy("createdAt", "desc")
    );

    if (featured) {
      q = query(
        collection(db, "products"),
        where("inStock", "==", true),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(6)
      );
    }

    if (category) {
      q = query(
        collection(db, "products"),
        where("inStock", "==", true),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get all products (for admin panel)
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Services Functions
export const getServices = async (featured?: boolean, category?: string): Promise<Service[]> => {
  try {
    let q = query(
      collection(db, "services"),
      where("available", "==", true),
      orderBy("createdAt", "desc")
    );

    if (featured) {
      q = query(
        collection(db, "services"),
        where("available", "==", true),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(3)
      );
    }

    if (category) {
      q = query(
        collection(db, "services"),
        where("available", "==", true),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Service[];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const getService = async (id: string): Promise<Service | null> => {
  try {
    const docRef = doc(db, "services", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Service;
    }
    return null;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
};

// Gallery Functions
export const getGalleryImages = async (featured?: boolean, category?: string): Promise<GalleryImage[]> => {
  try {
    let q = query(
      collection(db, "gallery"),
      where("visible", "==", true),
      orderBy("createdAt", "desc")
    );

    if (featured) {
      q = query(
        collection(db, "gallery"),
        where("visible", "==", true),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(12)
      );
    }

    if (category) {
      q = query(
        collection(db, "gallery"),
        where("visible", "==", true),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as GalleryImage[];
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
};

export const getGalleryImage = async (id: string): Promise<GalleryImage | null> => {
  try {
    const docRef = doc(db, "gallery", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as GalleryImage;
    }
    return null;
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return null;
  }
};

export const getAllGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const q = query(
      collection(db, "gallery"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as GalleryImage[];
  } catch (error) {
    console.error("Error fetching all gallery images:", error);
    return [];
  }
};

// Award Functions
export const getAwards = async (featured?: boolean, category?: string): Promise<Award[]> => {
  try {
    let q = query(
      collection(db, "awards"),
      where("visible", "==", true),
      orderBy("year", "desc"),
      orderBy("createdAt", "desc")
    );

    if (featured) {
      q = query(
        collection(db, "awards"),
        where("visible", "==", true),
        where("featured", "==", true),
        orderBy("year", "desc"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
    }

    if (category) {
      q = query(
        collection(db, "awards"),
        where("visible", "==", true),
        where("category", "==", category),
        orderBy("year", "desc"),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      awardDate: doc.data().awardDate?.toDate() || null,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Award[];
  } catch (error) {
    console.error("Error fetching awards:", error);
    return [];
  }
};

export const getAward = async (id: string): Promise<Award | null> => {
  try {
    const docRef = doc(db, "awards", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        awardDate: docSnap.data().awardDate?.toDate() || null,
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Award;
    }
    return null;
  } catch (error) {
    console.error("Error fetching award:", error);
    return null;
  }
};

export const getAllAwards = async (): Promise<Award[]> => {
  try {
    const q = query(
      collection(db, "awards"),
      orderBy("year", "desc"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      awardDate: doc.data().awardDate?.toDate() || null,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Award[];
  } catch (error) {
    console.error("Error fetching all awards:", error);
    return [];
  }
};

// Create Functions
export const createProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "properties"), {
      ...propertyData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const createService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "services"), {
      ...serviceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

export const createGalleryImage = async (galleryData: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "gallery"), {
      ...galleryData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating gallery image:", error);
    throw error;
  }
};

export const createAward = async (awardData: Omit<Award, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "awards"), {
      ...awardData,
      awardDate: awardData.awardDate ? Timestamp.fromDate(awardData.awardDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating award:", error);
    throw error;
  }
};

// Update Functions
export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<void> => {
  try {
    const docRef = doc(db, "properties", id);
    await updateDoc(docRef, {
      ...propertyData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const updateService = async (id: string, serviceData: Partial<Service>): Promise<void> => {
  try {
    const docRef = doc(db, "services", id);
    await updateDoc(docRef, {
      ...serviceData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export const updateGalleryImage = async (id: string, galleryData: Partial<GalleryImage>): Promise<void> => {
  try {
    const docRef = doc(db, "gallery", id);
    await updateDoc(docRef, {
      ...galleryData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating gallery image:", error);
    throw error;
  }
};

export const updateAward = async (id: string, awardData: Partial<Award>): Promise<void> => {
  try {
    const docRef = doc(db, "awards", id);
    const updateData: any = {
      ...awardData,
      updatedAt: Timestamp.now(),
    };
    
    // Handle awardDate conversion
    if (awardData.awardDate !== undefined) {
      updateData.awardDate = awardData.awardDate ? Timestamp.fromDate(awardData.awardDate) : null;
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating award:", error);
    throw error;
  }
};

// Delete Functions
export const deleteProperty = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "properties", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "services", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "gallery", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw error;
  }
};

export const deleteAward = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "awards", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting award:", error);
    throw error;
  }
};

// Alias functions for detail pages
export const getPropertyById = getProperty;
export const getProductById = getProduct;
export const getServiceById = getService;
export const getGalleryImageById = getGalleryImage;
export const getAwardById = getAward;