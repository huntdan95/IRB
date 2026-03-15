import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = (() => {
  // Firebase App Hosting provides this at build time (server-side only).
  // next.config.js copies it into NEXT_PUBLIC_ vars for the client bundle.
  const webappConfig = process.env.FIREBASE_WEBAPP_CONFIG;
  if (webappConfig) {
    return JSON.parse(webappConfig);
  }
  // Fallback to individual env vars (local dev or set by next.config.js from FIREBASE_WEBAPP_CONFIG).
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
})();

let app: FirebaseApp | null = null;

export function getApp(): FirebaseApp {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0] as FirebaseApp;
    return app;
  }
  app = initializeApp(firebaseConfig);
  return app;
}

export function getAuthInstance(): Auth {
  return getAuth(getApp());
}

export function getDb(): Firestore {
  return getFirestore(getApp());
}

export function getStorageInstance(): FirebaseStorage {
  return getStorage(getApp());
}

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(getApp());
}
