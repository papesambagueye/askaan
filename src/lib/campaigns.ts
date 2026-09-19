import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Campaign = { id: string; title: string; description: string; category: string; goal_cfa: number; image_url: string | null; payment_url: string; status: "pending" | "published" | "rejected" | "paused"; owner_id: string; owner_name?: string; raised_cfa: number; supporters: number; created_at: string };

export async function getPublishedCampaigns(): Promise<Campaign[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("campaigns").select("*, profiles(full_name), donations(amount_cfa, status, donor_id)").eq("status", "published").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((campaign: any) => ({ ...campaign, owner_name: campaign.profiles?.full_name ?? "", raised_cfa: (campaign.donations ?? []).filter((d: any) => d.status === "confirmed").reduce((sum: number, d: any) => sum + Number(d.amount_cfa), 0), supporters: new Set((campaign.donations ?? []).filter((d: any) => d.status === "confirmed").map((d: any) => d.donor_id ?? d.id)).size }));
}
export const formatCFA = (amount: number) => new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
export const percent = (raised: number, goal: number) => goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
