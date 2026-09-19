import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://askaan.vercel.app"),
  title: { default: "ASKAAN 221 | Donnons vie à l'essentiel", template: "%s | ASKAAN 221" },
  description: "ASKAAN 221 est la plateforme sénégalaise pour lancer, soutenir et partager des collectes qui comptent.",
  keywords: ["ASKAAN 221", "Askaan Sénégal", "collecte de fonds Sénégal", "cagnotte Sénégal", "solidarité Sénégal", "Wave", "Orange Money"],
  applicationName: "ASKAAN 221",
  authors: [{ name: "ASKAAN 221" }],
  creator: "ASKAAN 221",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fr_SN", url: "/", siteName: "ASKAAN 221", title: "ASKAAN 221 | Les collectes qui comptent", description: "Lancer ou soutenir une collecte au Sénégal." },
  twitter: { card: "summary", title: "ASKAAN 221", description: "La plateforme sénégalaise des collectes qui comptent." },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context": "https://schema.org", "@type": "Organization", name: "ASKAAN 221", url: process.env.NEXT_PUBLIC_SITE_URL || "https://askaan.vercel.app", description: "Plateforme sénégalaise de collecte de fonds et de solidarité." };
  return <html lang="fr"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>;
}
