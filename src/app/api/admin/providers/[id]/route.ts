import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAuthed } from "@/lib/admin-auth";
import { repository } from "@/lib/data";

// Owner-only: delete any listing from the dashboard.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isAuthed(cookie)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  try {
    await repository.adminDelete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Admin delete needs the Supabase service key. Set SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy.",
      },
      { status: 503 },
    );
  }
}
