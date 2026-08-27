/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.accessa.ng",
      },
      {
        protocol: "https",
        hostname: "cdn.logosystem.co",
      },
    ],
  },
};

export default nextConfig
