"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Upload } from "lucide-react";
import { Header } from "@/components/Header";

export default function CreatePage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData(event.currentTarget);
      const image = form.get("image");
      let image_url = "";
      if (image instanceof File && image.size > 0) {
        const upload = new FormData();
        upload.set("image", image);
        const imageResponse = await fetch("/api/campaigns/image", {
          method: "POST",
          body: upload,
        });
        const imageResult = await imageResponse.json();
        if (!imageResponse.ok) throw new Error(imageResult.error);
        image_url = imageResult.image_url;
      }
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          category: form.get("category"),
          goal_cfa: form.get("goal_cfa"),
          payment_url: form.get("payment_url"),
          image_url,
          first_name: form.get("first_name"),
          last_name: form.get("last_name"),
          phone: form.get("phone"),
          whatsapp: form.get("whatsapp") === "on",
          contact_email: form.get("contact_email"),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error ?? "Connexion requise pour soumettre une collecte.",
        );
      setSent(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent)
    return (
      <>
        <Header />
        <main className="mx-auto max-w-xl px-5 py-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f7c844]">
            <Check />
          </div>
          <h1 className="mt-7 text-4xl font-bold tracking-[-.06em]">
            Votre collecte est en route.
          </h1>
          <p className="mt-4 text-[#77746d]">
            Elle attend la validation de l&apos;équipe ASKAAN.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[#161616] px-5 py-3 text-sm font-bold text-white"
          >
            Retour à l&apos;accueil
          </Link>
        </main>
      </>
    );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-8 lg:px-8">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#77746d]"
        >
          <ArrowLeft size={16} /> Annuler
        </Link>
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#77746d]">
            Nouveau projet
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-[-.07em]">
            Donnez une forme
            <br />
            <span className="text-[#b08b00]">à votre élan.</span>
          </h1>
        </div>
        <form onSubmit={submit} className="space-y-7">
          <section className="space-y-5 rounded-2xl border border-[#d9d6cd] bg-white/40 p-5">
            <div>
              <h2 className="text-lg font-bold">Informations du créateur</h2>
              <p className="mt-1 text-sm font-normal text-[#77746d]">Ces informations restent réservées à l&apos;équipe ASKAAN pour vous contacter.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold">Prénom<input name="first_name" required className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5" /></label>
              <label className="block text-sm font-bold">Nom<input name="last_name" required className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5" /></label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold">Téléphone<input name="phone" required type="tel" className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5" /></label>
              <label className="block text-sm font-bold">E-mail (optionnel)<input name="contact_email" type="email" className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5" /></label>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold"><input name="whatsapp" type="checkbox" className="h-4 w-4 accent-[#f7c844]" /> Ce numéro est aussi mon WhatsApp</label>
          </section>
          <label className="block text-sm font-bold">
            Titre
            <input
              name="title"
              required
              minLength={5}
              className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5"
            />
          </label>
          <label className="block text-sm font-bold">
            Description
            <textarea
              name="description"
              required
              minLength={20}
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold">
              Objectif (FCFA)
              <input
                name="goal_cfa"
                required
                type="number"
                min="1"
                className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5"
              />
            </label>
            <label className="block text-sm font-bold">
              Catégorie
              <select
                name="category"
                className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5"
              >
                <option>Éducation</option>
                <option>Santé</option>
                <option>Entraide</option>
                <option>Emploi</option>
                <option>Sport</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-bold">
            Lien Wave / Orange Money
            <input
              name="payment_url"
              required
              type="url"
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-[#d9d6cd] bg-white/60 px-4 py-3.5"
            />
          </label>
          <label className="block cursor-pointer text-sm font-bold">
            Image de la collecte
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-[#bdb9af] bg-white/50 px-4 py-4 font-normal">
              <Upload size={18} />
              <span>{imageName || "Choisir une image dans la galerie"}</span>
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) =>
                  setImageName(event.target.files?.[0]?.name ?? "")
                }
              />
            </span>
            <span className="mt-2 block text-xs font-normal text-[#77746d]">
              JPG, PNG ou WebP, 5 Mo maximum.
            </span>
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-[#f7c844] px-5 py-3 text-sm font-bold disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Soumettre la collecte"}
            <ArrowUpRight size={16} />
          </button>
        </form>
      </main>
    </>
  );
}
