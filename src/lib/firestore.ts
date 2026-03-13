import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Property, Booking, Review, SiteSettings } from "@/types";

// Properties
export async function getProperty(slug: string): Promise<Property | null> {
  const propertiesRef = collection(db, "properties");
  const q = query(propertiesRef, where("slug", "==", slug), where("active", "==", true));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Property;
}

export async function getAllProperties(): Promise<Property[]> {
  const propertiesRef = collection(db, "properties");
  const q = query(propertiesRef, where("active", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Property[];
}

// Bookings
export async function getBookings(
  propertyId?: string,
  constraints?: QueryConstraint[]
): Promise<Booking[]> {
  const bookingsRef = collection(db, "bookings");
  let q = query(bookingsRef);
  
  if (propertyId) {
    q = query(bookingsRef, where("propertyId", "==", propertyId));
  }
  
  if (constraints) {
    q = query(bookingsRef, ...constraints);
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Booking[];
}

export async function createBooking(booking: Omit<Booking, "id">): Promise<string> {
  const bookingsRef = collection(db, "bookings");
  const docRef = await addDoc(bookingsRef, {
    ...booking,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Reviews
export async function getReviews(propertyId?: string): Promise<Review[]> {
  const reviewsRef = collection(db, "reviews");
  let q = query(reviewsRef, where("approved", "==", true));
  
  if (propertyId) {
    q = query(reviewsRef, where("propertyId", "==", propertyId), where("approved", "==", true));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Review[];
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const settingsRef = collection(db, "siteSettings");
  const snapshot = await getDocs(settingsRef);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as SiteSettings;
}
