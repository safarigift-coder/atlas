import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pomodoroSessions, skills, calendarDays } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

function getTodayStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { durationMinutes, mode, notes, skillId } = body;
    const todayStr = getTodayStr();

    // 1. Insert session
    const inserted = await db
      .insert(pomodoroSessions)
      .values({
        date: todayStr,
        durationMinutes: Number(durationMinutes) || 25,
        mode: mode || "25/5",
        notes: notes || "Focus Session",
      })
      .returning();

    // 2. If skillId is provided, award XP
    let awardedXp = 0;
    if (skillId) {
      awardedXp =
        Number(durationMinutes) >= 90
          ? 250
          : Number(durationMinutes) >= 50
          ? 120
          : 50;
      await db
        .update(skills)
        .set({
          currentXp: sql`current_xp + ${awardedXp}`,
          tasksCompletedCount: sql`tasks_completed_count + 1`,
        })
        .where(eq(skills.id, Number(skillId)));
    }

    // 3. Update calendar day focus hours
    const calRows = await db
      .select()
      .from(calendarDays)
      .where(eq(calendarDays.date, todayStr));

    const addedHours = Number((Number(durationMinutes) / 60).toFixed(2));
    if (calRows.length > 0) {
      await db
        .update(calendarDays)
        .set({
          hoursFocused: sql`hours_focused + ${addedHours}`,
        })
        .where(eq(calendarDays.date, todayStr));
    } else {
      await db.insert(calendarDays).values({
        date: todayStr,
        status: "Green",
        hoursFocused: addedHours,
        mood: "🔥 Unstoppable",
        projectsCompleted: 0,
        incomeEarned: 0,
        notes: notes || "Pomodoro deep work",
      });
    }

    return NextResponse.json({
      success: true,
      session: inserted[0],
      awardedXp,
    });
  } catch (err: any) {
    console.error("Error in /api/pomodoro:", err);
    return NextResponse.json(
      { error: "Pomodoro log failed", details: err.message },
      { status: 500 }
    );
  }
}
