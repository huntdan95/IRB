import type { Amenity } from "@/types";

interface AmenityGridProps {
  amenities: Amenity[];
}

export default function AmenityGrid({ amenities }: AmenityGridProps) {
  if (!amenities || amenities.length === 0) {
    return (
      <p className="text-driftwood">
        Detailed amenities will be added soon. Please contact us if you have specific questions.
      </p>
    );
  }

  const byCategory = amenities.reduce<Record<string, Amenity[]>>((acc, amenity) => {
    if (!acc[amenity.category]) acc[amenity.category] = [];
    acc[amenity.category].push(amenity);
    return acc;
  }, {});

  const categories = Object.entries(byCategory);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {categories.map(([category, items]) => (
        <div key={category}>
          <h3 className="font-display text-xl mb-4 text-deep-ocean">{category}</h3>
          <ul className="grid grid-cols-2 gap-3 text-driftwood text-sm">
            {items.map((item) => (
              <li key={`${item.category}-${item.name}`} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sea-glass" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

