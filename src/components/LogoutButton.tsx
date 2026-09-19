"use client";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.replace("/");
  }
  return <button type="button" onClick={logout} className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"><LogOut size={14}/> Se déconnecter</button>;
}