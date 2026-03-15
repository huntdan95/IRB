/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: (() => {
    const webappConfig = process.env.FIREBASE_WEBAPP_CONFIG;
    if (!webappConfig) return {};
    const c = JSON.parse(webappConfig);
    return {
      NEXT_PUBLIC_FIREBASE_API_KEY: c.apiKey,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: c.authDomain,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: c.projectId,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: c.storageBucket,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: c.messagingSenderId,
      NEXT_PUBLIC_FIREBASE_APP_ID: c.appId,
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: c.measurementId ?? "",
    };
  })(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
