"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: form.get("full_name"), email: form.get("email"), password: form.get("password") }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Inscription impossible.");
    else { setMessage(result.message); event.currentTarget.reset(); }
  }
  return <main className="mx-auto max-w-md px-5 py-16"><Link href="/creer" className="inline-flex items-center gap-2 text-sm text-[#77746d]"><ArrowLeft size={16}/> Retour à la création</Link><h1 className="mt-16 text-4xl font-bold tracking-[-.06em]">Compte créateur</h1><p className="mt-3 text-[#77746d]">Un compte est nécessaire uniquement pour lancer une collecte. Aucun compte n&apos;est demandé pour participer.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm font-bold">Nom complet<input required name="full_name" className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5" /></label><label className="block text-sm font-bold">E-mail<input required name="email" type="email" className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5" /></label><label className="block text-sm font-bold">Mot de passe<input required name="password" type="password" minLength={6} className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5" /></label>{error && <p className="text-sm text-red-700">{error}</p>}{message && <p className="rounded-xl bg-[#dcebd8] p-4 text-sm text-green-900">{message} <Link href="/connexion?next=%2Fcreer" className="font-bold underline">Se connecter</Link></p>}<button className="w-full rounded-full bg-[#161616] px-5 py-4 font-bold text-white">Créer mon compte</button></form><p className="mt-6 text-center text-sm text-[#77746d]">Déjà inscrit ? <Link href="/connexion?next=%2Fcreer" className="font-bold underline">Se connecter</Link></p></main>;
}