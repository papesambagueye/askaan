import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }, { protocol: "https", hostname: "wdttzwxopvkjnrfeirsc.supabase.co" }] },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
