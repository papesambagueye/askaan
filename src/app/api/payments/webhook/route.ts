import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  const signature = request.headers.get("x-payment-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Webhook non configuré" }, { status: 503 });
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  const payload = JSON.parse(rawBody) as { campaign_id?: string; payment_reference?: string; amount_cfa?: number; status?: "pending" | "confirmed" | "failed" | "refunded"; provider?: string };
  if (!payload.payment_reference || !payload.status || !payload.amount_cfa || !["pending", "confirmed", "failed", "refunded"].includes(payload.status)) return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  const admin = getSupabaseAdminClient();
  const { data: existing } = await admin.from("donations").select("id").eq("payment_reference", payload.payment_reference).maybeSingle();
  const values = { campaign_id: payload.campaign_id, amount_cfa: payload.amount_cfa, payment_reference: payload.payment_reference, status: payload.status, provider: payload.provider ?? "unknown", provider_payload: payload };
  const { error } = existing ? await admin.from("donations").update(values).eq("id", existing.id) : await admin.from("donations").insert(values);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
