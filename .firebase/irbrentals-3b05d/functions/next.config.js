"use strict";

// next.config.js
var nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com"
      }
    ]
  },
  experimental: {
    turbo: {
      root: process.cwd()
    }
  }
};
module.exports = nextConfig;
