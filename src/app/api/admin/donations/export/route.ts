import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function csv(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const { data, error } = await supabase.from("donations").select("id, campaign_id, amount_cfa, payment_reference, status, provider, created_at, campaigns(title)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const rows = ["id,campagne,montant_fcfa,reference,statut,fournisseur,date", ...(data ?? []).map(item => [item.id, (item.campaigns as { title?: string } | null)?.title, item.amount_cfa, item.payment_reference, item.status, item.provider, item.created_at].map(csv).join(","))];
  return new NextResponse(rows.join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=askaan-dons.csv" } });
}
