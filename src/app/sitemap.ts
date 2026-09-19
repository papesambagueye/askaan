import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://askaan.vercel.app"; return [{ url: baseUrl, lastModified: new Date() }, { url: `${baseUrl}/creer`, lastModified: new Date() }, { url: `${baseUrl}/connexion`, lastModified: new Date() }]; }
