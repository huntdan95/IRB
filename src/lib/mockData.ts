import { Timestamp } from "firebase/firestore";
import type { Booking, Review } from "@/types";

/** Mock property ID slugs used when Firestore returns no properties (display names only). */
export const MOCK_PROPERTY_IDS = {
  SUNRISE: "mock-sunrise",
  SUNSET: "mock-sunset",
} as const;

export function getPropertyDisplayName(
  propertyId: string,
  propertyName?: string | null
): string {
  if (propertyName) return propertyName;
  if (propertyId === MOCK_PROPERTY_IDS.SUNRISE) return "Sunrise Suite";
  if (propertyId === MOCK_PROPERTY_IDS.SUNSET) return "Sunset Suite";
  return propertyId;
}

const now = new Date();
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 24 * 60 * 60 * 1000);

function ts(d: Date) {
  return Timestamp.fromDate(d);
}

/** Sample bookings for admin when Firestore returns empty. */
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "mock-1",
    propertyId: MOCK_PROPERTY_IDS.SUNRISE,
    guestName: "Sarah Mitchell",
    guestEmail: "sarah.m@example.com",
    guestPhone: "(555) 123-4567",
    checkIn: ts(addDays(now, 3)),
    checkOut: ts(addDays(now, 7)),
    numGuests: 4,
    nightlyRate: 185,
    numNights: 4,
    cleaningFee: 125,
    taxes: 92.5,
    totalPrice: 917.5,
    status: "confirmed",
    specialRequests: "Late check-in around 6 PM if possible.",
    ownerNotes: "",
    isManualBlock: false,
    createdAt: ts(addDays(now, -12)),
    updatedAt: ts(now),
  },
  {
    id: "mock-2",
    propertyId: MOCK_PROPERTY_IDS.SUNSET,
    guestName: "James Chen",
    guestEmail: "j.chen@example.com",
    guestPhone: "(555) 987-6543",
    checkIn: ts(addDays(now, -2)),
    checkOut: ts(addDays(now, 4)),
    numGuests: 2,
    nightlyRate: 195,
    numNights: 6,
    cleaningFee: 125,
    taxes: 138.75,
    totalPrice: 1478.75,
    status: "confirmed",
    ownerNotes: "Repeat guest.",
    isManualBlock: false,
    createdAt: ts(addDays(now, -25)),
    updatedAt: ts(now),
  },
  {
    id: "mock-3",
    propertyId: MOCK_PROPERTY_IDS.SUNRISE,
    guestName: "Owner block",
    guestEmail: "",
    guestPhone: "",
    checkIn: ts(addDays(now, 14)),
    checkOut: ts(addDays(now, 18)),
    numGuests: 0,
    nightlyRate: 0,
    numNights: 0,
    cleaningFee: 0,
    taxes: 0,
    totalPrice: 0,
    status: "confirmed",
    specialRequests: "Personal stay",
    ownerNotes: "",
    isManualBlock: true,
    createdAt: ts(addDays(now, -5)),
    updatedAt: ts(now),
  },
  {
    id: "mock-4",
    propertyId: MOCK_PROPERTY_IDS.SUNSET,
    guestName: "Emily Rodriguez",
    guestEmail: "emily.r@example.com",
    guestPhone: "",
    checkIn: ts(addDays(now, 10)),
    checkOut: ts(addDays(now, 14)),
    numGuests: 5,
    nightlyRate: 195,
    numNights: 4,
    cleaningFee: 125,
    taxes: 92.5,
    totalPrice: 997.5,
    status: "pending",
    isManualBlock: false,
    createdAt: ts(addDays(now, -1)),
    updatedAt: ts(now),
  },
  {
    id: "mock-5",
    propertyId: MOCK_PROPERTY_IDS.SUNRISE,
    guestName: "Michael Brown",
    guestEmail: "mbrown@example.com",
    guestPhone: "(555) 222-3333",
    checkIn: ts(addDays(now, -15)),
    checkOut: ts(addDays(now, -10)),
    numGuests: 3,
    nightlyRate: 185,
    numNights: 5,
    cleaningFee: 125,
    taxes: 115.63,
    totalPrice: 1155.63,
    status: "completed",
    isManualBlock: false,
    createdAt: ts(addDays(now, -30)),
    updatedAt: ts(now),
  },
  {
    id: "mock-6",
    propertyId: MOCK_PROPERTY_IDS.SUNSET,
    guestName: "Lisa Park",
    guestEmail: "lisa.p@example.com",
    guestPhone: "",
    checkIn: ts(addDays(now, 20)),
    checkOut: ts(addDays(now, 25)),
    numGuests: 4,
    nightlyRate: 195,
    numNights: 5,
    cleaningFee: 125,
    taxes: 115.63,
    totalPrice: 1205.63,
    status: "confirmed",
    isManualBlock: false,
    createdAt: ts(addDays(now, -3)),
    updatedAt: ts(now),
  },
];

/** Sample reviews for admin when Firestore returns empty. */
export const MOCK_REVIEWS: Review[] = [
  {
    id: "mock-r1",
    propertyId: MOCK_PROPERTY_IDS.SUNRISE,
    guestName: "Michael Brown",
    rating: 5,
    text: "Perfect beach getaway. The condo was spotless and the view was incredible. We'll definitely be back!",
    ownerResponse: "Thank you so much! We're glad you enjoyed your stay.",
    approved: true,
    source: "direct",
    createdAt: ts(addDays(now, -8)),
  },
  {
    id: "mock-r2",
    propertyId: MOCK_PROPERTY_IDS.SUNSET,
    guestName: "Anonymous",
    rating: 4,
    text: "Great location and very comfortable. Only minor issue was the WiFi was a bit slow in the evening.",
    approved: true,
    source: "manual",
    createdAt: ts(addDays(now, -20)),
  },
];
