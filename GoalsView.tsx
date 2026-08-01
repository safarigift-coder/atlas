import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

function getLevelFromXp(xp: number): { level: string; levelIndex: number } {
  if (xp >= 2000) return { level: "Legend", levelIndex: 6 };
  if (xp >= 1400) return { level: "Creative Master", levelIndex: 5 };
  if (xp >= 900) return { level: "Creative Expert", levelIndex: 4 };
  if (xp >= 500) return { level: "Creative Professional", levelIndex: 3 };
  if (xp >= 200) return { level: "Creative Explorer", levelIndex: 2 };
  return { level: "Creative Beginner", levelIndex: 1 };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skillId, amount } = body;
    const addedXp = Number(amount) || 50;

    const currentSkillRows = await db
      .select()
      .from(skills)
      .where(eq(skills.id, Number(skillId)));

    if (currentSkillRows.length === 0) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const current = currentSkillRows[0];
    const newXp = current.currentXp + addedXp;
    const { level, levelIndex } = getLevelFromXp(newXp);

    const updated = await db
      .update(skills)
      .set({
        currentXp: newXp,
        level,
        levelIndex,
        tasksCompletedCount: sql`tasks_completed_count + 1`,
      })
      .where(eq(skills.id, Number(skillId)))
      .returning();

    return NextResponse.json({ success: true, skill: updated[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
