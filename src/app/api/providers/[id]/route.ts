import { NextResponse } from "next/server";
import { repository } from "@/lib/data";
import { ctxFromParams } from "../../_ctx";

// GET /api/providers/:id?lat=&lng=&city=&country=&currency=&locale=
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const provider = await repository.getById(id, ctxFromParams(searchParams));
  if (!provider) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ provider });
}
