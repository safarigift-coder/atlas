import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { journalEntries, calendarDays } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      date,
      qCompleted,
      qChallenged,
      qLearned,
      qGrateful,
      qTomorrow,
      contentMarkdown,
      mood,
    } = body;

    const todayStr = date || new Date().toISOString().split("T")[0];

    const existing = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.date, todayStr));

    let updated;
    if (existing.length > 0) {
      updated = await db
        .update(journalEntries)
        .set({
          qCompleted: qCompleted ?? existing[0].qCompleted,
          qChallenged: qChallenged ?? existing[0].qChallenged,
          qLearned: qLearned ?? existing[0].qLearned,
          qGrateful: qGrateful ?? existing[0].qGrateful,
          qTomorrow: qTomorrow ?? existing[0].qTomorrow,
          contentMarkdown: contentMarkdown ?? existing[0].contentMarkdown,
          mood: mood ?? existing[0].mood,
        })
        .where(eq(journalEntries.date, todayStr))
        .returning();
    } else {
      updated = await db
        .insert(journalEntries)
        .values({
          date: todayStr,
          qCompleted: qCompleted || "",
          qChallenged: qChallenged || "",
          qLearned: qLearned || "",
          qGrateful: qGrateful || "",
          qTomorrow: qTomorrow || "",
          contentMarkdown:
            contentMarkdown ||
            `# Daily Review - ${todayStr}\n\nToday's progress and creative reflections.`,
          mood: mood || "🔥 Unstoppable",
        })
        .returning();
    }

    // Also update mood on calendarDay
    const calRows = await db
      .select()
      .from(calendarDays)
      .where(eq(calendarDays.date, todayStr));
    if (calRows.length > 0) {
      await db
        .update(calendarDays)
        .set({ mood: mood || "🔥 Unstoppable" })
        .where(eq(calendarDays.date, todayStr));
    }

    return NextResponse.json({ success: true, entry: updated[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
