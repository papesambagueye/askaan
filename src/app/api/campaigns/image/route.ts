import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("image");
  if (!(file instanceof File) || !allowedTypes.has(file.type)) return NextResponse.json({ error: "Image JPG, PNG ou WebP requise" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "L'image doit faire 5 Mo maximum" }, { status: 400 });
  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("campaign-images").upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data } = supabase.storage.from("campaign-images").getPublicUrl(path);
  return NextResponse.json({ image_url: data.publicUrl }, { status: 201 });
}