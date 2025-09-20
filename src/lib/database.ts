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
  detailedDescription: string; // Rich text content
  images: string[];
  price: number;
  originalPrice?: number; // For showing discounts
  unit: string;
  category: 'dairy' | 'grains' | 'vegetables' | 'spices' | 'handicrafts' | 'other';
  inStock: boolean;
  stock: number; // Quantity available
  featured: boolean;
  organic: boolean;
  weight?: string;
  nutritionalInfo?: string;
  ingredients?: string[];
  benefits?: string[];
  storageInstructions?: string;
  shelfLife?: string;
  origin?: string;
  certifications?: string[];
  tags?: string[];
  rating?: number;
  reviewCount?: number;
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

// Gallery Types (Updated for simplified media management)
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

// Simplified Media Types
export interface MediaItem {
  id: string;
  imageUrl: string;
  type: 'gallery' | 'media';
  visible: boolean;
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

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string; // Optional for guest orders
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'qr_code' | 'card' | 'upi' | 'cash_on_delivery';
  transactionId?: string;
  shippingAddress: ShippingAddress;
  notes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Booking Types
export interface BookingGuest {
  adults: number;
  women: number;
  children: number;
  infants: number;
}

export interface PropertyBooking {
  id: string;
  bookingNumber: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  userId?: string;
  guestInfo: {
    fullName: string;
    phone: string;
    email: string;
  };
  checkIn: Date;
  checkOut: Date;
  guests: BookingGuest;
  totalNights: number;
  pricePerNight: number;
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'qr_code' | 'card' | 'upi' | 'cash_on_arrival';
  transactionId?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceBooking {
  id: string;
  bookingNumber: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  userId?: string;
  guestInfo: {
    fullName: string;
    phone: string;
    email: string;
  };
  bookingDate: Date;
  timeSlot: string;
  guests: BookingGuest;
  totalGuests: number;
  pricePerPerson: number;
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'qr_code' | 'card' | 'upi' | 'cash_on_arrival';
  transactionId?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Settings Interface
export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  address: string;
  phone: string;
  email: string;
  isLaunched: boolean;
  launchedAt?: Date;
  launchedBy?: string;
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

// Media Functions (Simplified System)
export const getMediaItems = async (type?: 'gallery' | 'media'): Promise<MediaItem[]> => {
  try {
    let q = query(
      collection(db, "media"),
      where("visible", "==", true),
      orderBy("createdAt", "desc")
    );

    if (type) {
      q = query(
        collection(db, "media"),
        where("visible", "==", true),
        where("type", "==", type),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as MediaItem[];
  } catch (error) {
    console.error("Error fetching media items:", error);
    return [];
  }
};

export const getAllMediaItems = async (): Promise<MediaItem[]> => {
  try {
    const q = query(
      collection(db, "media"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as MediaItem[];
  } catch (error) {
    console.error("Error fetching all media items:", error);
    return [];
  }
};

export const createMediaItem = async (mediaData: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "media"), {
      ...mediaData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating media item:", error);
    throw error;
  }
};

export const updateMediaItem = async (id: string, mediaData: Partial<MediaItem>): Promise<void> => {
  try {
    const docRef = doc(db, "media", id);
    await updateDoc(docRef, {
      ...mediaData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating media item:", error);
    throw error;
  }
};

export const deleteMediaItem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "media", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting media item:", error);
    throw error;
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

// Order Functions
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `IG${timestamp.slice(-6)}${random}`;
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const orderNumber = generateOrderNumber();
    
    const cleanOrderData: any = {
      ...orderData,
      orderNumber,
      estimatedDelivery: orderData.estimatedDelivery ? Timestamp.fromDate(orderData.estimatedDelivery) : null,
      deliveredAt: orderData.deliveredAt ? Timestamp.fromDate(orderData.deliveredAt) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Remove undefined fields to prevent Firebase errors
    Object.keys(cleanOrderData).forEach(key => {
      if (cleanOrderData[key] === undefined) {
        delete cleanOrderData[key];
      }
    });
    
    const docRef = await addDoc(collection(db, "orders"), cleanOrderData);
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrder = async (id: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        estimatedDelivery: data.estimatedDelivery?.toDate() || null,
        deliveredAt: data.deliveredAt?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
};

export const getOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("orderNumber", "==", orderNumber),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        estimatedDelivery: data.estimatedDelivery?.toDate() || null,
        deliveredAt: data.deliveredAt?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting order by number:", error);
    throw error;
  }
};

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<void> => {
  try {
    const docRef = doc(db, "orders", id);
    
    const updateData: any = {
      ...orderData,
      updatedAt: Timestamp.now(),
    };

    // Convert dates to Timestamps
    if (orderData.estimatedDelivery) {
      updateData.estimatedDelivery = Timestamp.fromDate(orderData.estimatedDelivery);
    }
    if (orderData.deliveredAt) {
      updateData.deliveredAt = Timestamp.fromDate(orderData.deliveredAt);
    }

    // Remove undefined fields to prevent Firebase errors
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        estimatedDelivery: data.estimatedDelivery?.toDate() || null,
        deliveredAt: data.deliveredAt?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }) as Order[];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        estimatedDelivery: data.estimatedDelivery?.toDate() || null,
        deliveredAt: data.deliveredAt?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }) as Order[];
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};

// Booking Functions
export const generateBookingNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK${timestamp.slice(-6)}${random}`;
};

// Property Booking Functions
export const createPropertyBooking = async (bookingData: Omit<PropertyBooking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const bookingNumber = generateBookingNumber();
    
    const cleanBookingData: any = {
      ...bookingData,
      bookingNumber,
      checkIn: Timestamp.fromDate(bookingData.checkIn),
      checkOut: Timestamp.fromDate(bookingData.checkOut),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Remove undefined fields
    Object.keys(cleanBookingData).forEach(key => {
      if (cleanBookingData[key] === undefined) {
        delete cleanBookingData[key];
      }
    });
    
    const docRef = await addDoc(collection(db, "propertyBookings"), cleanBookingData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating property booking:", error);
    throw error;
  }
};

export const getPropertyBooking = async (id: string): Promise<PropertyBooking | null> => {
  try {
    const docRef = doc(db, "propertyBookings", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        checkIn: data.checkIn?.toDate() || new Date(),
        checkOut: data.checkOut?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as PropertyBooking;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting property booking:", error);
    throw error;
  }
};

// Service Booking Functions
export const createServiceBooking = async (bookingData: Omit<ServiceBooking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const bookingNumber = generateBookingNumber();
    
    const cleanBookingData: any = {
      ...bookingData,
      bookingNumber,
      bookingDate: Timestamp.fromDate(bookingData.bookingDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Remove undefined fields
    Object.keys(cleanBookingData).forEach(key => {
      if (cleanBookingData[key] === undefined) {
        delete cleanBookingData[key];
      }
    });
    
    const docRef = await addDoc(collection(db, "serviceBookings"), cleanBookingData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating service booking:", error);
    throw error;
  }
};

export const getServiceBooking = async (id: string): Promise<ServiceBooking | null> => {
  try {
    const docRef = doc(db, "serviceBookings", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        bookingDate: data.bookingDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ServiceBooking;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting service booking:", error);
    throw error;
  }
};

// Settings Functions
export const getSettings = async (): Promise<SiteSettings | null> => {
  try {
    const q = query(collection(db, "settings"), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        launchedAt: data.launchedAt?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as SiteSettings;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw error;
  }
};

export const createSettings = async (settingsData: Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const cleanSettingsData: any = {
      ...settingsData,
      launchedAt: settingsData.launchedAt ? Timestamp.fromDate(settingsData.launchedAt) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Remove undefined fields
    Object.keys(cleanSettingsData).forEach(key => {
      if (cleanSettingsData[key] === undefined) {
        delete cleanSettingsData[key];
      }
    });
    
    const docRef = await addDoc(collection(db, "settings"), cleanSettingsData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating settings:", error);
    throw error;
  }
};

export const updateSettings = async (id: string, settingsData: Partial<SiteSettings>): Promise<void> => {
  try {
    const docRef = doc(db, "settings", id);
    
    const updateData: any = {
      ...settingsData,
      updatedAt: Timestamp.now(),
    };

    // Convert dates to Timestamps
    if (settingsData.launchedAt) {
      updateData.launchedAt = Timestamp.fromDate(settingsData.launchedAt);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export const launchWebsite = async (): Promise<void> => {
  try {
    const settings = await getSettings();
    
    if (settings) {
      await updateSettings(settings.id, {
        isLaunched: true,
        launchedAt: new Date(),
      });
    } else {
      // Create initial settings if none exist
      await createSettings({
        siteName: "IG Thar Village Global Herbs Pure Food & Agro Tourism Group",
        tagline: "Village Life, Global Wellness",
        address: "Village & Post - Jhak, Tehsil - Batadu, District - Barmer, Rajasthan - 344035",
        phone: "8302676869",
        email: "info@igtharvillage.com",
        isLaunched: true,
        launchedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error launching website:", error);
    throw error;
  }
};