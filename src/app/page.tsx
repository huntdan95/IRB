import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BEACHFRONT_PROPERTIES } from "@/data/beachfrontProperties";

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://irbcondos.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "IRB Condos",
    description:
      "Book your stay at our beautifully updated beachfront condos in Indian Rocks Beach, Florida. Gulf views, steps from the sand, fully equipped.",
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indian Rocks Beach",
      addressRegion: "FL",
      addressCountry: "US",
    },
    amenities: [
      "Beachfront",
      "Full kitchen",
      "Free Wi‑Fi",
      "Washer / dryer",
    ],
  };

  return (
    <>
      <Script
        id="ld-json-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-deep-ocean/60 to-deep-ocean/80 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920')] bg-cover bg-center animate-[kenburns_20s_ease-in-out_infinite]" />
          <div className="relative z-20 text-center text-white px-4">
            <h1 className="font-display text-5xl md:text-7xl mb-4 text-balance">
              Your Gulf Coast Escape
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-sand/90">
              Beachfront condos in Indian Rocks Beach, Florida
            </p>
            <Link
              href="#availability"
              className="inline-block px-8 py-4 bg-sea-glass text-white rounded-lg hover:bg-sea-glass/90 transition-warm shadow-warm-lg text-lg font-semibold"
            >
              Check Availability
            </Link>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-20 px-4 bg-shell">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-4xl md:text-5xl mb-6 text-deep-ocean text-balance">
                Welcome to Indian Rocks Beach
              </h2>
              <p className="text-lg text-driftwood leading-relaxed mb-8">
                Experience the perfect blend of relaxation and adventure in our two beautifully
                appointed beachfront condos. Located directly on the Gulf of Mexico, these
                properties offer stunning ocean views, direct beach access, and all the comforts of
                home.
              </p>
              <div className="w-full h-64 bg-driftwood/10 rounded-lg flex items-center justify-center">
                <p className="text-driftwood">Map placeholder - Google Maps will go here</p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Property Cards Section */}
        <section id="availability" className="py-20 px-4 bg-sand">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-4xl md:text-5xl text-center mb-12 text-deep-ocean">
                Our Properties
              </h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 gap-8">
              {BEACHFRONT_PROPERTIES.map((property, index) => (
                <ScrollReveal key={property.id} delay={index === 0 ? 100 : 200}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-warm-lg hover:shadow-warm transition-warm group">
                    <div className="relative h-64 bg-driftwood/20 overflow-hidden">
                      <Image
                        src={property.heroImage}
                        alt={property.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 768px) 50vw, 100vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-2xl mb-2 text-deep-ocean">
                        {property.name}
                      </h3>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-driftwood">
                        <span>2 BR</span>
                        <span>·</span>
                        <span>2 BA</span>
                        <span>·</span>
                        <span>Gulf View</span>
                        <span>·</span>
                        <span>Sleeps 6</span>
                      </div>
                      <p className="text-deep-ocean mb-4">
                        {property.cardDescription ?? property.shortDescription}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-semibold text-coral">
                            ${property.pricing.baseRate}
                          </span>
                          <span className="text-driftwood">/night</span>
                        </div>
                        <Link
                          href={`/properties/${property.slug}`}
                          className="px-6 py-2 bg-sea-glass text-white rounded-lg hover:bg-sea-glass/90 transition-warm"
                        >
                          View Property →
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why Stay With Us Section */}
        <section className="py-20 px-4 bg-white">
          <ScrollReveal>
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl text-center mb-12 text-deep-ocean">
                Why Stay With Us
              </h2>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { title: "Beachfront Location", desc: "Direct access to the Gulf of Mexico" },
                  { title: "Fully Equipped", desc: "Everything you need for a comfortable stay" },
                  { title: "No Service Fees", desc: "Transparent pricing, no hidden costs" },
                  { title: "Local Owner", desc: "Personal attention and local recommendations" },
                ].map((feature, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 bg-sea-glass/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-sea-glass rounded-full" />
                    </div>
                    <h3 className="font-display text-xl mb-2 text-deep-ocean">{feature.title}</h3>
                    <p className="text-driftwood">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-shell">
          <ScrollReveal>
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl text-center mb-12 text-deep-ocean">
                What Our Guests Say
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Sarah M.",
                    rating: 5,
                    text: "Absolutely perfect location! The condo was spotless and had everything we needed. We'll definitely be back!",
                  },
                  {
                    name: "Michael T.",
                    rating: 5,
                    text: "Best vacation rental we've stayed in. The views are incredible and the owner was so helpful with local recommendations.",
                  },
                  {
                    name: "Jennifer L.",
                    rating: 5,
                    text: "The beach access can't be beat. We loved waking up to the sound of the waves every morning.",
                  },
                ].map((review, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-warm">
                    <div className="flex mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-coral text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-driftwood mb-4 italic">&ldquo;{review.text}&rdquo;</p>
                    <p className="text-deep-ocean font-semibold">— {review.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </>
  );
}
