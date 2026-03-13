# IRB Rentals - Vacation Rental Website

A professional, modern vacation rental booking website for beachfront condos in Indian Rocks Beach, Florida.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom coastal theme
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payments**: Stripe Checkout
- **Email**: Resend/SendGrid

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` (if it exists)
   - Add your Firebase credentials:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```
   - Add Stripe keys:
     ```
     STRIPE_SECRET_KEY=your_stripe_secret_key
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
     ```
   - Add Resend API key:
     ```
     RESEND_API_KEY=your_resend_api_key
     ```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/      # React components
│   ├── layout/      # Navbar, Footer
│   ├── ui/          # Reusable UI components
│   └── ...
├── lib/             # Utility functions
│   ├── firebase.ts  # Firebase initialization
│   └── firestore.ts # Firestore helpers
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Firebase Storage
5. Add your Firebase config to `.env.local`

## Development Phases

- ✅ **Phase 1**: Foundation (Project setup, Tailwind theme, Firebase config, global layout, homepage)
- ⏳ **Phase 2**: Properties (Property detail pages, photo gallery, amenities)
- ⏳ **Phase 3**: Availability & Booking (Calendar, pricing, Stripe checkout)
- ⏳ **Phase 4**: Admin Core (Auth, dashboard, bookings management)
- ⏳ **Phase 5**: Admin Property Management (Photo upload, pricing editor)
- ⏳ **Phase 6**: Admin Calendar & Extras
- ⏳ **Phase 7**: Polish (Animations, SEO, performance)

## Design System

### Colors
- **Sand**: `#F5F0E8` - Primary background
- **Driftwood**: `#A89279` - Warm neutral
- **Deep Ocean**: `#1B3A4B` - Primary text
- **Sea Glass**: `#6B9F9E` - Accent/CTAs
- **Coral**: `#E07A5F` - Secondary accent

### Typography
- **Display**: DM Serif Display (headings)
- **Body**: Source Sans 3 (body text)
- **Accent**: Caveat (callouts)

## License

Private project - All rights reserved
