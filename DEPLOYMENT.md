# Deployment

This app uses **Next.js standalone output** (`output: "standalone"` in `next.config.js`) and is designed for a Node.js server runtime, not static file hosting.

## Firebase App Hosting (recommended)

Deploy by **pushing to the connected GitHub branch**. Firebase App Hosting builds from source, uses `.next/standalone`, and runs the app on its managed runtime. No local `firebase deploy` is required.

- Ensure your repo is connected in [Firebase Console](https://console.firebase.google.com) → App Hosting.
- Push to the configured branch (e.g. `main`) to trigger a build and deploy.

## Firebase Hosting via CLI (optional)

To deploy from your machine with the Firebase CLI, the project uses **framework-aware hosting** (`"source": "."` in `firebase.json`), not static `out/`:

- Run `firebase experiments:enable webframeworks` once (if using framework preview).
- Run `npm run build` then `firebase deploy --only hosting` (or `npm run deploy:hosting`).

The CLI builds the Next.js app from source and deploys it; there is no `out` directory with standalone output.

## Summary

| Method              | How                         | Config used                    |
|---------------------|-----------------------------|--------------------------------|
| App Hosting         | Push to GitHub              | `next.config.js` (standalone)  |
| CLI (hosting)       | `firebase deploy --only hosting` | `firebase.json` (`source: "."`) |

Do **not** set `output: "export"` in `next.config.js` if you use Firebase App Hosting; it conflicts with the standalone adapter.
