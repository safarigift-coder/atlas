import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await db.select().from(userProfile);

    let updated;
    if (existing.length > 0) {
      updated = await db
        .update(userProfile)
        .set({
          name: body.name ?? existing[0].name,
          title: body.title ?? existing[0].title,
          tagline: body.tagline ?? existing[0].tagline,
          theme: body.theme ?? existing[0].theme,
          currentStreak: body.currentStreak ?? existing[0].currentStreak,
          longestStreak: body.longestStreak ?? existing[0].longestStreak,
          dayOfChallenge: body.dayOfChallenge ?? existing[0].dayOfChallenge,
          totalChallengeDays:
            body.totalChallengeDays ?? existing[0].totalChallengeDays,
          soundEnabled: body.soundEnabled ?? existing[0].soundEnabled,
          notificationsEnabled:
            body.notificationsEnabled ?? existing[0].notificationsEnabled,
          dailyReminderTime:
            body.dailyReminderTime ?? existing[0].dailyReminderTime,
          updatedAt: new Date(),
        })
        .where(eq(userProfile.id, existing[0].id))
        .returning();
    } else {
      updated = await db
        .insert(userProfile)
        .values({
          name: body.name || "Alex Vance",
          title: body.title || "Creative Entrepreneur & Designer",
          tagline:
            body.tagline || "Build. Create. Grow. Every Single Day.",
          theme: body.theme || "dark",
          currentStreak: body.currentStreak ?? 12,
          longestStreak: body.longestStreak ?? 18,
          dayOfChallenge: body.dayOfChallenge ?? 18,
          totalChallengeDays: body.totalChallengeDays ?? 30,
          soundEnabled: body.soundEnabled ?? true,
          notificationsEnabled: body.notificationsEnabled ?? true,
          dailyReminderTime: body.dailyReminderTime || "08:00",
        })
        .returning();
    }

    return NextResponse.json({ success: true, profile: updated[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
