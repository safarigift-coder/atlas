import { NextResponse } from "next/server";
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
} from "@/db/schema";

export async function GET() {
  try {
    const backup = {
      version: "ATLAS_OS_v1",
      exportedAt: new Date().toISOString(),
      userProfile: await db.select().from(userProfile),
      dailyMissions: await db.select().from(dailyMissions),
      pomodoroSessions: await db.select().from(pomodoroSessions),
      clients: await db.select().from(clients),
      incomeTransactions: await db.select().from(incomeTransactions),
      portfolioProjects: await db.select().from(portfolioProjects),
      skills: await db.select().from(skills),
      achievements: await db.select().from(achievements),
      calendarDays: await db.select().from(calendarDays),
      journalEntries: await db.select().from(journalEntries),
      goals: await db.select().from(goals),
      visionBoardItems: await db.select().from(visionBoardItems),
      motivationalQuotes: await db.select().from(motivationalQuotes),
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="ATLAS_OS_BACKUP.json"',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Backup export failed", details: err.message },
      { status: 500 }
    );
  }
}
