"use client";
import { Copy, Share2 } from "lucide-react";
import { useState } from "react";

export function CampaignActions({ title }: { title: string }) {
  const [message, setMessage] = useState("");
  async function copy() { await navigator.clipboard.writeText(window.location.href); setMessage("Lien copié"); }
  async function share() { if (navigator.share) await navigator.share({ title, url: window.location.href }); else await copy(); }
  return <div className="mt-6 flex items-center gap-3"><button onClick={share} className="flex items-center gap-2 rounded-full border border-[#d9d6cd] px-4 py-2 text-sm font-semibold"><Share2 size={15}/> Partager</button><button onClick={copy} className="rounded-full border border-[#d9d6cd] p-2" aria-label="Copier le lien"><Copy size={15}/></button>{message && <span className="text-sm text-[#77746d]">{message}</span>}</div>;
}