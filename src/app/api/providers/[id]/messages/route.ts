import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/data/supabase/client";

// POST /api/providers/:id/messages — send a message (or booking) to a listing.
// Public: clients don't need an account. The listing owner reads it in /inbox.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: { senderName?: string; senderContact?: string; body?: string; kind?: string } | null =
    null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const senderName = body?.senderName?.trim();
  const text = body?.body?.trim();
  if (!senderName) return NextResponse.json({ error: "Your name is required." }, { status: 400 });
  if (!text) return NextResponse.json({ error: "Write a message." }, { status: 400 });

  const contact =
    typeof body?.senderContact === "string" ? body.senderContact.trim().slice(0, 120) : null;
  const kind = body?.kind === "booking" ? "booking" : "message";

  try {
    const { error } = await getSupabase().from("messages").insert({
      listing_id: id,
      sender_name: senderName.slice(0, 80),
      sender_contact: contact || null,
      body: text.slice(0, 2000),
      kind,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Couldn’t send — messaging isn’t set up yet." },
      { status: 503 },
    );
  }
}
