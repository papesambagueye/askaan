import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
  return NextResponse.json({ ok: true });
}