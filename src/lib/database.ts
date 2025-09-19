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

// Alias functions for detail pages
export const getPropertyById = getProperty;
export const getProductById = getProduct;
export const getServiceById = getService;