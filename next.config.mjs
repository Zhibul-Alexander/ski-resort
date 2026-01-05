/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BOOKING_ENDPOINT: process.env.NEXT_PUBLIC_BOOKING_ENDPOINT || ""
  }
};

export default nextConfig;
