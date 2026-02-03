import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // For compliance record-keeping, we log consent server-side.
    // In production you may want to persist this to a database.
    console.info("Cookie consent recorded:", JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to record cookie consent", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
