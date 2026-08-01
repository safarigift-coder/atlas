import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  userProfile,
  dailyMissions,
  pomodoroSessions,
  clients,
  incomeTransactions,
  portfolioProjects,
  skills,
  achievements,
  calendarDays,
  journalEntries,
  goals,
  visionBoardItems,
  motivationalQuotes,
  legacyEntries,
  userPromise,
  promiseWallMilestones,
} from "@/db/schema";
import { ensureSeedData, seedDemoData } from "@/db/seed";

export async function POST(req: NextRequest) {
  try {
    const mode = req.nextUrl.searchParams.get("mode");

    // Clear all tables
    await db.delete(dailyMissions);
    await db.delete(pomodoroSessions);
    await db.delete(incomeTransactions);
    await db.delete(clients);
    await db.delete(portfolioProjects);
    await db.delete(skills);
    await db.delete(achievements);
    await db.delete(calendarDays);
    await db.delete(journalEntries);
    await db.delete(goals);
    await db.delete(visionBoardItems);
    await db.delete(motivationalQuotes);
    await db.delete(legacyEntries);
    await db.delete(userPromise);
    await db.delete(promiseWallMilestones);
    await db.delete(userProfile);

    if (mode === "demo") {
      await seedDemoData();
      return NextResponse.json({
        success: true,
        message: "ATLAS OS loaded with rich demo sample data",
      });
    }

    // Default & mode === "empty": Clean new user starting from nothing (0 progress)
    await ensureSeedData();

    return NextResponse.json({
      success: true,
      message: "ATLAS OS reset to clean new user state from nothing",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Reset failed", details: err.message },
      { status: 500 }
    );
  }
}
