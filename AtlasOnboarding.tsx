import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { promiseWallMilestones } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, title, date, category } = body;

    if (action === "add") {
      const all = await db.select().from(promiseWallMilestones);
      const inserted = await db
        .insert(promiseWallMilestones)
        .values({
          title: title || "New Sacred Milestone",
          date: date || new Date().toISOString().split("T")[0],
          category: category || "milestone",
          orderIndex: all.length + 1,
        })
        .returning();
      return NextResponse.json({ success: true, item: inserted[0] });
    }

    if (action === "delete") {
      await db
        .delete(promiseWallMilestones)
        .where(eq(promiseWallMilestones.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
