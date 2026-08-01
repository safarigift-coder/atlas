import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dreamTimeline } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, year, title, milestones } = body;

    if (action === "add") {
      const all = await db.select().from(dreamTimeline);
      const inserted = await db
        .insert(dreamTimeline)
        .values({
          year: Number(year) || 2029,
          title: title || "Global Impact & Legacy",
          milestones: JSON.stringify(
            milestones || ["Open flagship studio", "Scale design team"]
          ),
          orderIndex: all.length + 1,
        })
        .returning();
      return NextResponse.json({
        success: true,
        item: { ...inserted[0], milestones: JSON.parse(inserted[0].milestones) },
      });
    }

    if (action === "update") {
      const updated = await db
        .update(dreamTimeline)
        .set({
          year: Number(year),
          title: title,
          milestones: JSON.stringify(milestones),
        })
        .where(eq(dreamTimeline.id, Number(id)))
        .returning();
      return NextResponse.json({
        success: true,
        item: { ...updated[0], milestones: JSON.parse(updated[0].milestones) },
      });
    }

    if (action === "delete") {
      await db
        .delete(dreamTimeline)
        .where(eq(dreamTimeline.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
