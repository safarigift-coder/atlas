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
} from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.version || !data.userProfile) {
      return NextResponse.json(
        { error: "Invalid ATLAS OS backup JSON format" },
        { status: 400 }
      );
    }

    // Clear existing tables and insert restored data
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
    await db.delete(userProfile);

    if (data.userProfile?.length) {
      await db.insert(userProfile).values(data.userProfile);
    }
    if (data.dailyMissions?.length) {
      await db.insert(dailyMissions).values(data.dailyMissions);
    }
    if (data.pomodoroSessions?.length) {
      await db.insert(pomodoroSessions).values(data.pomodoroSessions);
    }
    if (data.clients?.length) {
      await db.insert(clients).values(data.clients);
    }
    if (data.incomeTransactions?.length) {
      await db.insert(incomeTransactions).values(data.incomeTransactions);
    }
    if (data.portfolioProjects?.length) {
      await db.insert(portfolioProjects).values(data.portfolioProjects);
    }
    if (data.skills?.length) {
      await db.insert(skills).values(data.skills);
    }
    if (data.achievements?.length) {
      await db.insert(achievements).values(data.achievements);
    }
    if (data.calendarDays?.length) {
      await db.insert(calendarDays).values(data.calendarDays);
    }
    if (data.journalEntries?.length) {
      await db.insert(journalEntries).values(data.journalEntries);
    }
    if (data.goals?.length) {
      await db.insert(goals).values(data.goals);
    }
    if (data.visionBoardItems?.length) {
      await db.insert(visionBoardItems).values(data.visionBoardItems);
    }
    if (data.motivationalQuotes?.length) {
      await db.insert(motivationalQuotes).values(data.motivationalQuotes);
    }

    return NextResponse.json({
      success: true,
      message: "ATLAS OS restored successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Restore failed", details: err.message },
      { status: 500 }
    );
  }
}
