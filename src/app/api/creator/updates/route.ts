import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  const { campaign_id, title, body } = await request.json();
  if (!campaign_id || !title || !body) return NextResponse.json({ error: "Titre, texte et collecte requis" }, { status: 400 });
  const { data, error } = await supabase.from("campaign_updates").insert({ campaign_id, author_id: user.id, title, body }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ update: data }, { status: 201 });
}