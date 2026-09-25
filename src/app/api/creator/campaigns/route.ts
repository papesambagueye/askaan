import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

async function currentUser() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  const { data, error } = await supabase.from("campaigns").select("id, title, goal_cfa, status, created_at, rejection_reason, donations(amount_cfa, status), campaign_updates(id, title, body, created_at)").eq("owner_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data: profile } = await supabase.from("profiles").select("first_name, last_name, phone, whatsapp, contact_email").eq("id", user.id).single();
  return NextResponse.json({ campaigns: data ?? [], profile });
}

export async function PATCH(request: Request) {
  const { supabase, user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  const body = await request.json();
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from("profiles").update({ first_name: body.first_name, last_name: body.last_name, full_name: `${body.first_name} ${body.last_name}`.trim(), phone: body.phone, whatsapp: Boolean(body.whatsapp), contact_email: body.contact_email || null }).eq("id", user.id).select("first_name, last_name, phone, whatsapp, contact_email").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ profile: data });
}
