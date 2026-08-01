import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  dailyMissions,
  userProfile,
  calendarDays,
  achievements,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getRpgLevelInfo, getTaskXpReward } from "@/lib/rpg";

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
    const { action } = body;
    const todayStr = getTodayStr();

    if (action === "toggle") {
      const { id, completed } = body;

      // Find task to get name & xpReward
      const missionRows = await db
        .select()
        .from(dailyMissions)
        .where(eq(dailyMissions.id, id));
      const mission = missionRows[0];

      await db
        .update(dailyMissions)
        .set({
          completed: completed,
          completedAt: completed ? new Date() : null,
        })
        .where(eq(dailyMissions.id, id));

      let awardedXp = 0;
      let leveledUp = false;
      let newLevel = 14;
      let newLevelTitle = "Creative Explorer";
      let newXp = 1450;

      // Award XP if completed is true
      if (completed && mission) {
        awardedXp = mission.xpReward || getTaskXpReward(mission.taskName);
        const profileRows = await db.select().from(userProfile);
        const currentProfile = profileRows[0];

        if (currentProfile) {
          const prevXp = currentProfile.xp;
          const prevInfo = getRpgLevelInfo(prevXp);
          const updatedXp = prevXp + awardedXp;
          const newInfo = getRpgLevelInfo(updatedXp);

          newXp = updatedXp;
          newLevel = newInfo.level;
          newLevelTitle = newInfo.levelTitle;
          leveledUp = newInfo.level > prevInfo.level;

          await db
            .update(userProfile)
            .set({
              xp: updatedXp,
              level: newInfo.level,
              levelTitle: newInfo.levelTitle,
            })
            .where(eq(userProfile.id, currentProfile.id));
        }
      }

      // Check if all missions for today are completed
      const allToday = await db
        .select()
        .from(dailyMissions)
        .where(eq(dailyMissions.date, todayStr));

      const allCompleted =
        allToday.length > 0 && allToday.every((m) => m.completed);

      // If all completed, unlock 7-day streak badge if not yet unlocked
      if (allCompleted) {
        await db
          .update(achievements)
          .set({ unlocked: true, unlockedAt: todayStr })
          .where(eq(achievements.badgeId, "streak_7"));

        // Update calendar day status for today to Green
        const existingCal = await db
          .select()
          .from(calendarDays)
          .where(eq(calendarDays.date, todayStr));
        if (existingCal.length > 0) {
          await db
            .update(calendarDays)
            .set({ status: "Green" })
            .where(eq(calendarDays.date, todayStr));
        } else {
          await db.insert(calendarDays).values({
            date: todayStr,
            status: "Green",
            hoursFocused: 2.5,
            mood: "🔥 Unstoppable",
            projectsCompleted: 0,
            incomeEarned: 0,
            notes: "MISSION COMPLETE for today.",
          });
        }
      }

      return NextResponse.json({
        success: true,
        allCompleted,
        awardedXp,
        newXp,
        leveledUp,
        newLevel,
        newLevelTitle,
      });
    }

    if (action === "add") {
      const { category, taskName } = body;
      const allToday = await db
        .select()
        .from(dailyMissions)
        .where(eq(dailyMissions.date, todayStr));

      const newOrderIndex = allToday.length + 1;
      const reward = getTaskXpReward(taskName || "New Mission");

      const inserted = await db
        .insert(dailyMissions)
        .values({
          date: todayStr,
          category: category || "creative",
          taskName: taskName || "New Mission",
          completed: false,
          orderIndex: newOrderIndex,
          xpReward: reward,
        })
        .returning();

      return NextResponse.json({ success: true, mission: inserted[0] });
    }

    if (action === "delete") {
      const { id } = body;
      await db.delete(dailyMissions).where(eq(dailyMissions.id, id));
      return NextResponse.json({ success: true });
    }

    if (action === "resetToday") {
      await db
        .update(dailyMissions)
        .set({ completed: false, completedAt: null })
        .where(eq(dailyMissions.date, todayStr));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Error in /api/missions:", err);
    return NextResponse.json(
      { error: "Mission operation failed", details: err.message },
      { status: 500 }
    );
  }
}
