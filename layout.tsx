import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { legacyEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db
      .select()
      .from(legacyEntries)
      .orderBy(desc(legacyEntries.date));
    return NextResponse.json(all);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, meaningful, reflection } = body;
    const targetDate = date || new Date().toISOString().split("T")[0];

    const existing = await db
      .select()
      .from(legacyEntries)
      .where(eq(legacyEntries.date, targetDate));

    let updated;
    if (existing.length > 0) {
      updated = await db
        .update(legacyEntries)
        .set({
          meaningful: Boolean(meaningful),
          reflection: reflection ?? existing[0].reflection,
        })
        .where(eq(legacyEntries.date, targetDate))
        .returning();
    } else {
      updated = await db
        .insert(legacyEntries)
        .values({
          date: targetDate,
          meaningful: Boolean(meaningful),
          reflection: reflection || "",
        })
        .returning();
    }

    return NextResponse.json({ success: true, entry: updated[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
