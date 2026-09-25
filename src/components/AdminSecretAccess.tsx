"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export function AdminSecretAccess({ children, className, ...buttonProps }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();
  const clicks = useRef(0);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    clicks.current += 1;
    if (reset.current) clearTimeout(reset.current);
    if (clicks.current === 3) { clicks.current = 0; router.push("/connexion?next=%2Fadmin"); return; }
    reset.current = setTimeout(() => { clicks.current = 0; }, 700);
  }
  return <button type="button" onClick={handleClick} className={className} aria-label="Accès sécurisé" title="Accès sécurisé" {...buttonProps}>{children}</button>;
}
