import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ASKAAN | Donnons vie à l'essentiel", template: "%s | ASKAAN" },
  description: "La plateforme sénégalaise pour lancer, soutenir et partager des collectes qui comptent.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
