"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getSiteSettings } from "@/lib/firestore";

export default function AdminLoginPage() {
  const { signIn, loading, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [brandName, setBrandName] = useState("IRB Condos");

  useEffect(() => {
    getSiteSettings().then((s) => s && setBrandName(s.brandName));
  }, []);

  if (!loading && user) {
    router.replace("/admin");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch (err: any) {
      setError(err.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-warm-lg p-8">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl text-deep-ocean">{brandName}</h1>
          <p className="text-xs text-driftwood mt-1">Owner Admin</p>
        </div>
        <h2 className="font-display text-xl mb-2 text-deep-ocean text-center">Sign in</h2>
        <p className="text-sm text-driftwood mb-6 text-center">
          Access your private admin dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-ocean mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-glass/60 bg-sand/40"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-ocean mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-glass/60 bg-sand/40"
              required
            />
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-sea-glass text-white rounded-lg hover:bg-sea-glass/90 transition-warm shadow-warm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-xs text-driftwood text-center">
          Owner account is managed from the Firebase Console. No public registration.
        </p>
      </div>
    </div>
  );
}

