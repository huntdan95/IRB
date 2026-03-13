import { Timestamp, QueryConstraint, where } from "firebase/firestore";
import { isBefore, isAfter, isWithinInterval } from "date-fns";
import type { Booking } from "@/types";
import { getBookings } from "./firestore";

export interface BlockedRange {
  start: Date;
  end: Date;
}

export async function getBlockedRangesForProperty(propertyId: string): Promise<BlockedRange[]> {
  const constraints: QueryConstraint[] = [
    where("status", "in", ["confirmed"]),
    // manual blocks are represented via isManualBlock flag
  ];

  const bookings = await getBookings(propertyId, constraints);

  const manualBlocks = await getBookings(propertyId, [
    where("isManualBlock", "==", true),
  ]);

  const all = [...bookings, ...manualBlocks];

  return all.map((booking) => ({
    start: (booking.checkIn as Timestamp).toDate(),
    end: (booking.checkOut as Timestamp).toDate(),
  }));
}

export function isRangeAvailable(
  requestedStart: Date,
  requestedEnd: Date,
  blocked: BlockedRange[]
): boolean {
  if (requestedEnd <= requestedStart) return false;

  return blocked.every((range) => {
    const overlaps =
      isBefore(requestedStart, range.end) && isAfter(requestedEnd, range.start) ||
      isWithinInterval(range.start, { start: requestedStart, end: requestedEnd }) ||
      isWithinInterval(range.end, { start: requestedStart, end: requestedEnd });

    return !overlaps;
  });
}

