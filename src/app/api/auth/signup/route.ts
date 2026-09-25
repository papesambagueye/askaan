import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { email, password, full_name } = await request.json();
  if (!email || !password || !full_name || password.length < 6) return NextResponse.json({ error: "Nom, e-mail et mot de passe de 6 caractères minimum requis" }, { status: 400 });
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name } } });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, message: "Compte créé. Vérifiez votre e-mail si une confirmation est demandée." }, { status: 201 });
}