/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js build for Vercel (do not use output:"export" here —
  // that writes flat *.html files and often 404s unless Output Directory is
  // wired carefully). Pages stay fully static at build time.
  images: { unoptimized: true },
};

export default nextConfig;
