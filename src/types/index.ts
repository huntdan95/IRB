import { Timestamp } from "firebase/firestore";

export interface Property {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  photos: PropertyPhoto[];
  amenities: Amenity[];
  location: Location;
  houseRules: string[];
  specs: PropertySpecs;
  pricing: Pricing;
  cancellationPolicy: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PropertyPhoto {
  url: string;
  order: number;
  caption?: string;
}

export interface Amenity {
  name: string;
  category: string;
  icon: string;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
  nearbyAttractions: string[];
}

export interface PropertySpecs {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: number;
}

export interface Pricing {
  baseRate: number;
  cleaningFee: number;
  taxRate: number;
  minNights: number;
  seasonalRates: SeasonalRate[];
}

export interface SeasonalRate {
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  rate: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Timestamp;
  checkOut: Timestamp;
  numGuests: number;
  nightlyRate: number;
  numNights: number;
  cleaningFee: number;
  taxes: number;
  totalPrice: number;
  status: BookingStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  specialRequests?: string;
  ownerNotes?: string;
  isManualBlock: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

export interface Review {
  id: string;
  propertyId: string;
  bookingId?: string;
  guestName: string;
  rating: number;
  text: string;
  ownerResponse?: string;
  approved: boolean;
  source: "direct" | "manual";
  createdAt: Timestamp;
}

export interface SiteSettings {
  id: string;
  brandName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  aboutText: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
  };
  updatedAt: Timestamp;
}
