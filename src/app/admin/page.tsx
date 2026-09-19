"use client";
import { useEffect, useState } from "react";
import { Check, Clock3, Shield, X } from "lucide-react";
import Link from "next/link";
import { AdminUserForm } from "@/components/AdminUserForm";
import { LogoutButton } from "@/components/LogoutButton";

type Campaign = { id: string; title: string; goal_cfa: number; status: string; owner?: { full_name: string }; donations?: { amount_cfa: number; status: string }[] };
const money = (value: number) => new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
const raised = (item: Campaign) => (item.donations ?? []).filter(donation => donation.status === "confirmed").reduce((sum, donation) => sum + Number(donation.amount_cfa), 0);
const progress = (item: Campaign) => Math.min(100, Math.round((raised(item) / item.goal_cfa) * 100));

export default function AdminPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/campaigns").then(async response => {
      const result = await response.json();
      if (!response.ok) setError(result.error);
      else setItems(result.campaigns);
    });
  }, []);

  async function update(id: string, status: string) {
    const response = await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) setItems(current => current.map(item => item.id === id ? { ...item, status } : item));
  }

  return <main className="min-h-screen bg-[#f1f0eb] text-[#161616]">
    <aside className="fixed hidden h-screen w-64 flex-col bg-[#161616] p-6 text-white md:flex">
      <Link href="/" className="text-xl font-bold">ASKAAN</Link>
      <p className="mt-14 rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold">Vue d'ensemble</p>
      <p className="px-4 py-3 text-sm text-white/50">Campagnes</p>
      <p className="px-4 py-3 text-sm text-white/50">Utilisateurs</p>
      <div className="mt-auto"><LogoutButton /></div>
    </aside>
    <section className="md:ml-64">
      <header className="border-b border-[#d9d6cd] bg-[#f6f4ef] px-5 py-6 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#77746d]">Administration réelle</p>
        <h1 className="mt-1 text-2xl font-bold">Campagnes à valider</h1>
      </header>
      <div className="space-y-8 px-5 py-8 lg:px-10">
        <AdminUserForm />
        {error ? <div className="rounded-xl bg-[#f1d8d2] p-5 text-red-800">{error} <Link href="/connexion" className="font-bold underline">Se connecter</Link></div> : <>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={<Clock3 size={18}/>} label="À valider" value={String(items.filter(item => item.status === "pending").length)}/>
          <Stat icon={<Shield size={18}/>} label="Publiées" value={String(items.filter(item => item.status === "published").length)}/>
          <Stat icon={<Check size={18}/>} label="Total" value={String(items.length)}/>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[#d9d6cd] bg-[#f6f4ef] p-5"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[#d9d6cd] text-xs uppercase text-[#77746d]"><tr><th className="pb-3">Projet</th><th className="pb-3">Porteur</th><th className="pb-3">Progression</th><th className="pb-3">Statut</th><th className="pb-3">Action</th></tr></thead><tbody>{items.map(item => { const amount = raised(item); const percent = progress(item); const reached = amount >= item.goal_cfa; return <tr key={item.id} className="border-b border-[#e5e1d8]"><td className="py-4 font-semibold">{item.title}<span className="mt-1 block text-xs font-normal text-[#77746d]">Objectif : {money(item.goal_cfa)}</span></td><td className="py-4 text-[#77746d]">{item.owner?.full_name || "Utilisateur"}</td><td className="py-4"><span className="font-semibold">{money(amount)}</span><span className="ml-2 text-xs text-[#77746d]">{percent}%</span>{reached && <span className="mt-1 block text-xs font-bold text-green-700">Objectif atteint, contacter le porteur</span>}</td><td className="py-4">{item.status === "published" && reached ? "objectif atteint" : item.status}</td><td className="py-4">{item.status === "pending" && <div className="flex gap-2"><button onClick={() => update(item.id, "published")} aria-label="Valider" className="rounded-full bg-[#dcebd8] p-2"><Check size={15}/></button><button onClick={() => update(item.id, "rejected")} aria-label="Refuser" className="rounded-full bg-[#f1d8d2] p-2"><X size={15}/></button></div>}{item.status === "published" && <button onClick={() => update(item.id, "paused")} className="rounded-full bg-[#e7e3da] px-3 py-2 text-xs font-bold">Mettre en pause</button>}</td></tr>; })}</tbody></table></div>
        </>}
      </div>
    </section>
  </main>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-[#d9d6cd] bg-[#f6f4ef] p-5"><div className="mb-4 grid h-9 w-9 place-items-center rounded-lg bg-[#f7c844]">{icon}</div><p className="text-xs text-[#77746d]">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>;
}
