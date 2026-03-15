import { Timestamp } from "firebase/firestore";
import type { Property, PropertyPhoto, Amenity, Review } from "@/types";

const now = Timestamp.now();

const SUNRISE_PHOTOS: PropertyPhoto[] = [
  { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200", order: 0 },
  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", order: 1 },
  { url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800", order: 2 },
  { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", order: 3 },
  { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800", order: 4 },
];

const SUNSET_PHOTOS: PropertyPhoto[] = [
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", order: 0 },
  { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", order: 1 },
  { url: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800", order: 2 },
  { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", order: 3 },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", order: 4 },
];

const SHARED_AMENITIES: Amenity[] = [
  { name: "Full kitchen", category: "Kitchen", icon: "kitchen" },
  { name: "Dishwasher", category: "Kitchen", icon: "dishwasher" },
  { name: "Coffee maker", category: "Kitchen", icon: "coffee" },
  { name: "Refrigerator", category: "Kitchen", icon: "fridge" },
  { name: "Microwave", category: "Kitchen", icon: "microwave" },
  { name: "Cookware & dishes", category: "Kitchen", icon: "cookware" },
  { name: "2 bedrooms", category: "Bedrooms & Bath", icon: "bed" },
  { name: "2 bathrooms", category: "Bedrooms & Bath", icon: "bath" },
  { name: "Linens provided", category: "Bedrooms & Bath", icon: "linens" },
  { name: "Towels provided", category: "Bedrooms & Bath", icon: "towels" },
  { name: "Washer/Dryer", category: "Bedrooms & Bath", icon: "laundry" },
  { name: "Balcony with gulf view", category: "Outdoor", icon: "balcony" },
  { name: "Pool", category: "Outdoor", icon: "pool" },
  { name: "Beach access", category: "Outdoor", icon: "beach" },
  { name: "Parking", category: "Outdoor", icon: "parking" },
  { name: "Smart TV", category: "Entertainment", icon: "tv" },
  { name: "Streaming apps", category: "Entertainment", icon: "streaming" },
  { name: "WiFi", category: "Entertainment", icon: "wifi" },
  { name: "Air conditioning", category: "Climate", icon: "ac" },
  { name: "Ceiling fans", category: "Climate", icon: "fan" },
];

const HOUSE_RULES = [
  "Check-in: 4:00 PM",
  "Check-out: 10:00 AM",
  "No smoking",
  "No pets",
  "Max 6 guests",
  "Quiet hours: 10 PM - 8 AM",
  "No parties or events",
];

const CANCELLATION_POLICY =
  "Free cancellation up to 30 days before check-in. Cancel within 30 days for a 50% refund. No refund for cancellations within 7 days of check-in.";

const SUNRISE_REVIEWS: Omit<Review, "id" | "propertyId" | "createdAt">[] = [
  { guestName: "Sarah M.", rating: 5, text: "Absolutely perfect location! The condo was spotless and had everything we needed. Waking up to the Gulf view was incredible. We'll definitely be back!", approved: true, source: "direct" },
  { guestName: "Michael T.", rating: 5, text: "Best vacation rental we've stayed in. The sunrise from the balcony was worth the trip alone. The owner was so helpful with local recommendations.", approved: true, source: "direct" },
  { guestName: "Jennifer L.", rating: 5, text: "The beach access can't be beat. We loved the modern updates and how clean everything was. Perfect for our family of five.", approved: true, source: "direct" },
  { guestName: "David & Lisa K.", rating: 5, text: "Sunrise Suite lived up to its name — stunning mornings with coffee on the balcony. Would book again in a heartbeat.", approved: true, source: "direct" },
];

const SUNSET_REVIEWS: Omit<Review, "id" | "propertyId" | "createdAt">[] = [
  { guestName: "Amanda R.", rating: 5, text: "The sunset views from this condo are breathtaking. We watched the sun set over the Gulf every night. The place was immaculate and well stocked.", approved: true, source: "direct" },
  { guestName: "Chris and Beth.", rating: 5, text: "Perfect getaway. The condo had everything we needed and the sunsets were like something from a postcard. Indian Rocks Beach is a hidden gem.", approved: true, source: "direct" },
  { guestName: "Karen W.", rating: 5, text: "We've stayed in many beach rentals and Sunset Suite is at the top. Modern, comfortable, and those balcony views! Already planning our next stay.", approved: true, source: "direct" },
  { guestName: "James P.", rating: 5, text: "Incredible sunsets and a beautifully updated space. Steps to the beach and close to great restaurants. Couldn't ask for more.", approved: true, source: "direct" },
];

function toReview(r: Omit<Review, "id" | "propertyId" | "createdAt">, id: string, propertyId: string): Review {
  return { ...r, id, propertyId, createdAt: now };
}

export const SUNRISE_SUITE: Property = {
  id: "sunrise-suite",
  name: "Sunrise Suite",
  slug: "sunrise-suite",
  description:
    "Wake up to stunning Gulf views in our beautifully renovated Sunrise Suite. This modern 2-bedroom, 2-bathroom condo features an open floor plan with updated finishes throughout, a fully equipped kitchen, and a private balcony overlooking the Gulf of Mexico. Located in the heart of Indian Rocks Beach, you're just steps from the sand and minutes from local restaurants and shops.",
  shortDescription: "Modern 2BR/2BA beachfront condo with Gulf views — steps from the sand in Indian Rocks Beach.",
  heroImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200",
  photos: SUNRISE_PHOTOS,
  amenities: SHARED_AMENITIES,
  location: {
    address: "Indian Rocks Beach, Florida",
    lat: 27.8966,
    lng: -82.8512,
    nearbyAttractions: ["Steps to the beach", "5 min to local restaurants", "20 min to Clearwater Beach", "45 min to Tampa"],
  },
  houseRules: HOUSE_RULES,
  specs: { bedrooms: 2, bathrooms: 2, maxGuests: 6, sqft: 1200 },
  pricing: {
    baseRate: 199,
    cleaningFee: 150,
    taxRate: 12,
    minNights: 2,
    seasonalRates: [],
  },
  cancellationPolicy: CANCELLATION_POLICY,
  active: true,
  createdAt: now,
  updatedAt: now,
};

export const SUNSET_SUITE: Property = {
  id: "sunset-suite",
  name: "Sunset Suite",
  slug: "sunset-suite",
  description:
    "Unwind with breathtaking sunset views over the Gulf in our completely updated Sunset Suite. This spacious 2-bedroom, 2-bathroom condo offers contemporary design, a fully equipped kitchen, comfortable living spaces, and a private balcony perfect for watching the sun dip below the horizon. Located in Indian Rocks Beach, the beach is right at your doorstep.",
  shortDescription: "Spacious 2BR/2BA beachfront condo with sunset views — right on the Gulf in Indian Rocks Beach.",
  heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
  photos: SUNSET_PHOTOS,
  amenities: SHARED_AMENITIES,
  location: {
    address: "Indian Rocks Beach, Florida",
    lat: 27.8966,
    lng: -82.8512,
    nearbyAttractions: ["Steps to the beach", "5 min to local restaurants", "20 min to Clearwater Beach", "45 min to Tampa"],
  },
  houseRules: HOUSE_RULES,
  specs: { bedrooms: 2, bathrooms: 2, maxGuests: 6, sqft: 1200 },
  pricing: {
    baseRate: 199,
    cleaningFee: 150,
    taxRate: 12,
    minNights: 2,
    seasonalRates: [],
  },
  cancellationPolicy: CANCELLATION_POLICY,
  active: true,
  createdAt: now,
  updatedAt: now,
};

export const BEACHFRONT_PROPERTIES: Property[] = [SUNRISE_SUITE, SUNSET_SUITE];

export const SUNRISE_REVIEWS_LIST: Review[] = SUNRISE_REVIEWS.map((r, i) =>
  toReview(r, `sunrise-review-${i}`, SUNRISE_SUITE.id)
);

export const SUNSET_REVIEWS_LIST: Review[] = SUNSET_REVIEWS.map((r, i) =>
  toReview(r, `sunset-review-${i}`, SUNSET_SUITE.id)
);

export function getStaticPropertyBySlug(slug: string): Property | null {
  return BEACHFRONT_PROPERTIES.find((p) => p.slug === slug) ?? null;
}

export function getStaticReviewsForProperty(propertyId: string): Review[] {
  if (propertyId === SUNRISE_SUITE.id) return SUNRISE_REVIEWS_LIST;
  if (propertyId === SUNSET_SUITE.id) return SUNSET_REVIEWS_LIST;
  return [];
}
