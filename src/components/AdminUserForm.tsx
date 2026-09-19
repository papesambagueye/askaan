"use client";
import { FormEvent, useEffect, useState } from "react";

export function AdminUserForm() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users").then(async response => {
      if (response.ok) {
        const result = await response.json();
        setIsSuperAdmin(result.role === "super_admin");
      }
      setLoading(false);
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: form.get("full_name"), email: form.get("email"), password: form.get("password"), role: form.get("role") }) });
    const result = await response.json();
    if (!response.ok) { setStatus(result.error ?? "Création impossible"); return; }
    event.currentTarget.reset();
    setStatus("Compte créé. Transmettez le mot de passe initial de façon sécurisée.");
  }

  if (loading || !isSuperAdmin) return null;

  return <section className="rounded-2xl border border-[#d9d6cd] bg-[#f6f4ef] p-5 lg:p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#77746d]">Gestion des accès</p><h2 className="mt-1 text-xl font-bold">Créer un compte administrateur</h2><form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold">Nom complet<input required name="full_name" className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold">Adresse email<input required name="email" type="email" className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold">Mot de passe initial<input required name="password" type="password" minLength={6} className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold">Rôle<select name="role" defaultValue="admin" className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 font-normal"><option value="admin">Administrateur</option><option value="super_admin">Super administrateur</option></select></label><div className="md:col-span-2 flex flex-wrap items-center gap-4"><button className="rounded-full bg-[#161616] px-5 py-3 text-sm font-bold text-white">Créer le compte</button>{status && <p className="text-sm text-[#77746d]">{status}</p>}</div></form></section>;
}