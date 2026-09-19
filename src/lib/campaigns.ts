import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Campaign = { id: string; title: string; description: string; category: string; goal_cfa: number; image_url: string | null; payment_url: string; status: "pending" | "published" | "rejected" | "paused"; owner_id: string; owner_name?: string; raised_cfa: number; supporters: number; created_at: string };

export async function getPublishedCampaigns(): Promise<Campaign[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("campaigns").select("*, profiles(full_name), campaign_public_stats(raised_cfa, supporters)").eq("status", "published").order("created_at", { ascending: false });
  if (error) { console.error("Unable to load published campaigns", error.message); return []; }
  return (data ?? []).map((campaign: any) => ({ ...campaign, owner_name: campaign.profiles?.full_name ?? "", raised_cfa: Number(campaign.campaign_public_stats?.[0]?.raised_cfa ?? 0), supporters: Number(campaign.campaign_public_stats?.[0]?.supporters ?? 0) }));
}
export async function getCampaign(id: string) { const campaigns = await getPublishedCampaigns(); return campaigns.find(campaign => campaign.id === id) ?? null; }
export async function getCampaignUpdates(id: string) { const supabase = await getSupabaseServerClient(); const { data, error } = await supabase.from("campaign_updates").select("id, title, body, created_at").eq("campaign_id", id).order("created_at", { ascending: false }); if (error) { console.error("Unable to load campaign updates", error.message); return []; } return data ?? []; }
export const formatCFA = (amount: number) => new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
export const percent = (raised: number, goal: number) => goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
