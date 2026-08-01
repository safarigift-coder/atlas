import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { visionBoardItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, imageUrl, caption, targetDate, achieved } = body;

    const inserted = await db
      .insert(visionBoardItems)
      .values({
        title: title || "New Vision Goal",
        category: category || "Setup",
        imageUrl:
          imageUrl ||
          "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80",
        caption: caption || "My dream creative milestone.",
        targetDate: targetDate || "2026-12-31",
        achieved: Boolean(achieved),
      })
      .returning();

    return NextResponse.json({ success: true, item: inserted[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
