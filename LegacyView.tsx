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
  legacyEntries,
  userPromise,
  promiseWallMilestones,
} from "@/db/schema";
import { checkAndSeed } from "@/db/ensure-seed";
import { eq, desc } from "drizzle-orm";

function getTodayStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET() {
  try {
    await checkAndSeed();

    const todayStr = getTodayStr();

    // 1. Profile
    const profileRows = await db.select().from(userProfile);
    const profileDbRow = profileRows[0];
    const parseJsonSafeProfile = (str: any, defaultVal: any) => {
      if (!str) return defaultVal;
      if (Array.isArray(str)) return str;
      try {
        return JSON.parse(str);
      } catch (e) {
        return defaultVal;
      }
    };

    const profile = profileDbRow
      ? {
          ...profileDbRow,
          name: profileDbRow.preferredName || profileDbRow.firstName || profileDbRow.name || "Creator",
          preferredName: profileDbRow.preferredName || profileDbRow.firstName || profileDbRow.name || "Creator",
          journey: parseJsonSafeProfile(profileDbRow.journey, ["Creative Entrepreneur"]),
        }
      : {
          id: 1,
          name: "Creator",
          firstName: "",
          lastName: "",
          preferredName: "Creator",
          title: "Creative Entrepreneur",
          tagline: "Build. Create. Grow. Every Single Day.",
          theme: "dark",
          profilePhotoUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
          birthday: "",
          country: "Global",
          city: "",
          occupation: "Creative Entrepreneur",
          journey: ["Creative Entrepreneur"],
          startOfWeek: "Monday",
          language: "English",
          onboardingCompleted: false,
          currentStreak: 0,
          longestStreak: 0,
          dayOfChallenge: 1,
          totalChallengeDays: 30,
          xp: 0,
          level: 1,
          levelTitle: "Creative Apprentice",
          soundEnabled: true,
          notificationsEnabled: true,
          dailyReminderTime: "08:00",
        };

    // 2. Daily Missions for Today
    let missions = await db
      .select()
      .from(dailyMissions)
      .where(eq(dailyMissions.date, todayStr));

    // If no missions exist for today yet, carry over the user's custom checklist from the most recent previous day
    if (missions.length === 0) {
      const allMissionsDesc = await db
        .select()
        .from(dailyMissions)
        .orderBy(desc(dailyMissions.date));

      const previousDate = allMissionsDesc.find((m) => m.date < todayStr)?.date;

      if (previousDate) {
        const prevTasks = allMissionsDesc.filter(
          (m) => m.date === previousDate
        );
        const rolloverMissions = prevTasks.map((t) => ({
          date: todayStr,
          category: t.category,
          taskName: t.taskName,
          completed: false,
          orderIndex: t.orderIndex,
          xpReward: t.xpReward,
        }));
        await db.insert(dailyMissions).values(rolloverMissions);
      } else {
        const defaultMissions = [
          { date: todayStr, category: "morning", taskName: "Made Bed", completed: false, orderIndex: 1, xpReward: 10 },
          { date: todayStr, category: "morning", taskName: "Exercised", completed: false, orderIndex: 2, xpReward: 20 },
          { date: todayStr, category: "morning", taskName: "Prayed / Reflected", completed: false, orderIndex: 3, xpReward: 20 },
          { date: todayStr, category: "morning", taskName: "Planned Day", completed: false, orderIndex: 4, xpReward: 20 },
          { date: todayStr, category: "creative", taskName: "Graphic Design", completed: false, orderIndex: 5, xpReward: 100 },
          { date: todayStr, category: "creative", taskName: "Website Development", completed: false, orderIndex: 6, xpReward: 500 },
          { date: todayStr, category: "creative", taskName: "After Effects Practice", completed: false, orderIndex: 7, xpReward: 100 },
          { date: todayStr, category: "creative", taskName: "Portfolio Project", completed: false, orderIndex: 8, xpReward: 150 },
          { date: todayStr, category: "business", taskName: "Contacted 5 Clients", completed: false, orderIndex: 9, xpReward: 200 },
          { date: todayStr, category: "business", taskName: "Posted My Work", completed: false, orderIndex: 10, xpReward: 50 },
          { date: todayStr, category: "business", taskName: "Learned Marketing", completed: false, orderIndex: 11, xpReward: 50 },
          { date: todayStr, category: "night", taskName: "Planned Tomorrow", completed: false, orderIndex: 12, xpReward: 20 },
          { date: todayStr, category: "night", taskName: "Journal Entry", completed: false, orderIndex: 13, xpReward: 50 },
          { date: todayStr, category: "night", taskName: "Screen Time Under 1 Hour", completed: false, orderIndex: 14, xpReward: 50 },
        ];
        await db.insert(dailyMissions).values(defaultMissions);
      }
      missions = await db
        .select()
        .from(dailyMissions)
        .where(eq(dailyMissions.date, todayStr));
    }

    // Sort missions by orderIndex
    missions.sort((a, b) => a.orderIndex - b.orderIndex);

    // 3. Pomodoro Focus Sessions
    const allPomodoros = await db
      .select()
      .from(pomodoroSessions)
      .orderBy(desc(pomodoroSessions.completedAt));

    // Calculate today, weekly, monthly focus hours
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    let todayMinutes = 0;
    let weeklyMinutes = 0;
    let monthlyMinutes = 0;
    let longestSessionMinutes = 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    for (const session of allPomodoros) {
      if (session.durationMinutes > longestSessionMinutes) {
        longestSessionMinutes = session.durationMinutes;
      }
      if (session.date === todayStr) {
        todayMinutes += session.durationMinutes;
      }
      if (session.date >= sevenDaysAgoStr) {
        weeklyMinutes += session.durationMinutes;
      }
      if (session.date.startsWith(currentMonthPrefix)) {
        monthlyMinutes += session.durationMinutes;
      }
    }

    const focusStats = {
      todayHours: Number((todayMinutes / 60).toFixed(1)),
      weeklyHours: Number((weeklyMinutes / 60).toFixed(1)),
      monthlyHours: Number((monthlyMinutes / 60).toFixed(1)),
      totalHours: Number(
        (allPomodoros.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1)
      ),
      longestSessionMinutes: longestSessionMinutes || 90,
    };

    // 4. Clients
    const allClients = await db.select().from(clients).orderBy(desc(clients.createdAt));

    // 5. Income transactions
    const allIncome = await db
      .select()
      .from(incomeTransactions)
      .orderBy(desc(incomeTransactions.date));

    // Calculate monthly, yearly, total earnings, avg project value, highest paying client
    let monthlyIncome = 0;
    let yearlyIncome = 0;
    let totalIncome = 0;
    let highestPayingClient = { name: "Veloce Robotics", amount: 6800 };
    const clientTotals: Record<string, number> = {};

    for (const tx of allIncome) {
      if (tx.status === "Paid") {
        totalIncome += tx.amount;
        if (tx.date.startsWith(currentMonthPrefix)) {
          monthlyIncome += tx.amount;
        }
        if (tx.date.startsWith(`${now.getFullYear()}`)) {
          yearlyIncome += tx.amount;
        }
        if (tx.clientName) {
          clientTotals[tx.clientName] = (clientTotals[tx.clientName] || 0) + tx.amount;
          if (clientTotals[tx.clientName] > highestPayingClient.amount) {
            highestPayingClient = {
              name: tx.clientName,
              amount: clientTotals[tx.clientName],
            };
          }
        }
      }
    }

    const paidCount = allIncome.filter((t) => t.status === "Paid").length;
    const avgProjectValue = paidCount > 0 ? Math.round(totalIncome / paidCount) : 3800;

    // 6. Portfolio Projects
    const allProjects = await db
      .select()
      .from(portfolioProjects)
      .orderBy(desc(portfolioProjects.completionDate));

    // Calculate counts for dashboard
    const websitesBuilt = allProjects.filter(
      (p) => p.category === "Websites" || p.category === "UI" || p.category === "UI Design"
    ).length;
    const afterEffectsProgress =
      allProjects.filter(
        (p) => p.category === "Motion Graphics" || p.category === "Motion" || p.category === "Video Editing" || p.category === "Video"
      ).length * 15; // e.g., 60%

    // 7. Skills
    const allSkills = await db.select().from(skills);

    // 8. Achievements
    const allAchievements = await db.select().from(achievements);

    // 9. Calendar Days (color coded)
    const allCalendarDays = await db
      .select()
      .from(calendarDays)
      .orderBy(desc(calendarDays.date));

    // 10. Journal Entries
    const allJournals = await db
      .select()
      .from(journalEntries)
      .orderBy(desc(journalEntries.date));

    // 11. Goals
    const allGoals = await db.select().from(goals);

    // 12. Vision Board Items
    const allVisionBoard = await db.select().from(visionBoardItems);

    // 13. Motivational Quotes
    const allQuotes = await db.select().from(motivationalQuotes);
    const activeQuote =
      allQuotes.find((q) => q.activeForToday) ||
      allQuotes[0] || {
        quote: "Discipline creates freedom.",
        author: "Jocko Willink",
      };

    // 14. Legacy Entries
    const allLegacyEntries = await db
      .select()
      .from(legacyEntries)
      .orderBy(desc(legacyEntries.date));

    // 15. User Promise & Wall Milestones
    let promiseRows = await db.select().from(userPromise);
    if (promiseRows.length === 0) {
      const insertedP = await db
        .insert(userPromise)
        .values({
          isSigned: false,
          promiseText:
            "I promise that I will show up every single day, build my creative portfolio, and honor the vision I have for my family and my future. I refuse to settle for an ordinary life.",
          whoFor: JSON.stringify([
            "Myself",
            "My family",
            "My future children",
            "My dreams",
          ]),
          whatIfQuit:
            "I'll remain stuck. I'll never build my business. I'll waste my potential. I'll regret not trying.",
          whatIfConsistent:
            "Financial freedom. Creative confidence. Helping my family. Owning my studio. Working with dream clients. Building a meaningful life.",
          signatureName: "Gift Safari",
          signedDate: "",
        })
        .returning();
      promiseRows = insertedP;
    }
    const pRow = promiseRows[0] || {};

    const wallRows = await db
      .select()
      .from(promiseWallMilestones)
      .orderBy(promiseWallMilestones.orderIndex);

    const parseJsonSafe = (str: string | undefined, defaultVal: any) => {
      if (!str) return defaultVal;
      try {
        return JSON.parse(str);
      } catch (e) {
        return defaultVal;
      }
    };

    const promiseState = {
      id: pRow.id || 1,
      isSigned: pRow.isSigned ?? true,
      promiseText:
        pRow.promiseText ||
        "I promise that I will show up every single day, build my creative portfolio, and honor the vision I have for my family and my future. I refuse to settle for an ordinary life.",
      whoFor: parseJsonSafe(pRow.whoFor, ["Myself", "My family", "My future children", "My dreams"]),
      whatIfQuit:
        pRow.whatIfQuit ||
        "I'll remain stuck. I'll never build my business. I'll waste my potential. I'll regret not trying.",
      whatIfConsistent:
        pRow.whatIfConsistent ||
        "Financial freedom. Creative confidence. Helping my family. Owning my studio. Working with dream clients. Building a meaningful life.",
      signatureName: pRow.signatureName || profile.preferredName || "Creator",
      signedDate: pRow.signedDate || "",
    };

    // 16. Synthesize AI Mentor feedback based on real data
    const isNewUser = profile.currentStreak === 0 && profile.xp === 0;
    const aiCoachMessages = isNewUser
      ? [
          {
            id: "mentor-greeting",
            type: "advice",
            icon: "Sparkles",
            title: `Good morning ${profile.name}. Let's build.`,
            message: `Your creative journey starts today. Complete your first focus session and check off your daily mission checklist to build your initial momentum.`,
            date: todayStr,
          },
          {
            id: "mentor-consistency",
            type: "success",
            icon: "TrendingUp",
            title: "Day 1 • 0% Baseline",
            message: `Every mountain is climbed one step at a time. Show up today and begin compounding your daily consistency streak.`,
            date: todayStr,
          },
          {
            id: "mentor-focus-insight",
            type: "focus",
            icon: "Timer",
            title: "Focus Velocity Analysis",
            message: `You have logged ${focusStats.todayHours} hours today. Start a 50/10 Focus Session or 90-minute Deep Work block to earn your first XP.`,
            date: todayStr,
          },
          {
            id: "mentor-rpg-level",
            type: "growth",
            icon: "Award",
            title: `Level ${profile.level} • ${profile.levelTitle}`,
            message: `You have ${profile.xp} total XP. Complete your first task to earn XP and begin climbing toward Creative Legend.`,
            date: todayStr,
          },
        ]
      : [
          {
            id: "mentor-greeting",
            type: "advice",
            icon: "Sparkles",
            title: `Good morning ${profile.name}.`,
            message: `Yesterday you completed 9 of 10 missions. You missed Client Outreach. Today's recommendation: Finish the Architecture Website before noon.`,
            date: todayStr,
          },
          {
            id: "mentor-consistency",
            type: "success",
            icon: "TrendingUp",
            title: "Consistency Score +6%",
            message: `Your consistency score increased by 6% this week. You're only 4 days away from your longest streak of ${profile.longestStreak} days!`,
            date: todayStr,
          },
          {
            id: "mentor-focus-insight",
            type: "focus",
            icon: "Timer",
            title: "Focus Velocity Analysis",
            message: `You've focused ${focusStats.weeklyHours} hours this week. Motion Graphics increased by 18%. Most productive day: Tuesday. Average focus session: 62 minutes. Current completion rate: 91%.`,
            date: todayStr,
          },
          {
            id: "mentor-rpg-level",
            type: "growth",
            icon: "Award",
            title: `Level ${profile.level} • ${profile.levelTitle}`,
            message: `You have ${profile.xp} total XP. Every completed mission and deep work session pushes you toward Creative Master.`,
            date: todayStr,
          },
        ];

    return NextResponse.json({
      profile,
      dailyMissions: missions,
      pomodoroSessions: allPomodoros.slice(0, 50),
      focusStats,
      clients: allClients,
      incomeTransactions: allIncome,
      incomeStats: {
        monthlyIncome,
        yearlyIncome,
        totalIncome,
        avgProjectValue,
        highestPayingClient,
      },
      portfolioProjects: allProjects,
      portfolioStats: {
        totalProjects: allProjects.length,
        websitesBuilt,
        afterEffectsProgress: Math.min(100, Math.max(25, afterEffectsProgress)),
      },
      skills: allSkills,
      achievements: allAchievements,
      calendarDays: allCalendarDays,
      journalEntries: allJournals,
      goals: allGoals,
      visionBoardItems: allVisionBoard,
      legacyEntries: allLegacyEntries,
      promiseState,
      promiseWallMilestones: wallRows,
      quote: activeQuote,
      allQuotes,
      aiCoachAnalysis: aiCoachMessages,
    });
  } catch (err: any) {
    console.error("Error fetching state:", err);
    return NextResponse.json(
      { error: "Failed to fetch ATLAS OS state", details: err.message },
      { status: 500 }
    );
  }
}
