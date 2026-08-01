import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, targetValue, currentValue, unit, completed } =
      body;

    const inserted = await db
      .insert(goals)
      .values({
        title: title || "New Creative Goal",
        category: category || "Career",
        targetValue: Number(targetValue) || 100,
        currentValue: Number(currentValue) || 0,
        unit: unit || "%",
        completed: Boolean(completed),
      })
      .returning();

    return NextResponse.json({ success: true, goal: inserted[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
