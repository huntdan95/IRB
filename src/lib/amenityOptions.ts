import type { Amenity } from "@/types";

/** Full list of amenity options for admin property editor, grouped by category. */
export const AMENITY_OPTIONS: Amenity[] = [
  { name: "Full kitchen", category: "Kitchen", icon: "kitchen" },
  { name: "Dishwasher", category: "Kitchen", icon: "dishwasher" },
  { name: "Coffee maker", category: "Kitchen", icon: "coffee" },
  { name: "Refrigerator", category: "Kitchen", icon: "fridge" },
  { name: "Microwave", category: "Kitchen", icon: "microwave" },
  { name: "Cookware & dishes", category: "Kitchen", icon: "cookware" },
  { name: "2 bedrooms", category: "Bedroom & Bath", icon: "bed" },
  { name: "2 bathrooms", category: "Bedroom & Bath", icon: "bath" },
  { name: "Linens provided", category: "Bedroom & Bath", icon: "linens" },
  { name: "Towels provided", category: "Bedroom & Bath", icon: "towels" },
  { name: "Washer/Dryer", category: "Bedroom & Bath", icon: "laundry" },
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

const CATEGORY_ORDER = ["Kitchen", "Bedroom & Bath", "Outdoor", "Entertainment", "Climate"];

export function getAmenitiesByCategory(): { category: string; amenities: Amenity[] }[] {
  const byCat: Record<string, Amenity[]> = {};
  for (const a of AMENITY_OPTIONS) {
    const cat = a.category;
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(a);
  }
  return CATEGORY_ORDER.map((cat) => ({
    category: cat,
    amenities: byCat[cat] ?? [],
  })).filter((g) => g.amenities.length > 0);
}
