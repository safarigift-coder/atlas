import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  userProfile,
  skills,
  goals,
  futureRoomConfig,
  userPromise,
  promiseWallMilestones,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Update Profile
    const profileRows = await db.select().from(userProfile);
    const pRow = profileRows[0];
    const newName = data.preferredName || data.firstName || "Creator";

    const profileObj = {
      name: newName,
      firstName: data.firstName || "Creator",
      lastName: data.lastName || "",
      preferredName: newName,
      title: data.occupation || "Creative Entrepreneur",
      tagline: "Build. Create. Grow. Every Single Day.",
      theme: data.preferences?.theme || "dark",
      profilePhotoUrl:
        data.profilePhotoUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      birthday: data.birthday || "",
      country: data.country || "Global",
      city: data.city || "",
      occupation: data.occupation || "Creative Entrepreneur",
      journey: JSON.stringify(data.journey || ["Creative Entrepreneur"]),
      startOfWeek: data.preferences?.startOfWeek || "Monday",
      language: data.preferences?.language || "English",
      dailyReminderTime: data.preferences?.reminderTime || "08:00",
      notificationsEnabled:
        data.preferences?.notifications !== undefined
          ? data.preferences.notifications
          : true,
      onboardingCompleted: true,
      updatedAt: new Date(),
    };

    if (pRow) {
      await db
        .update(userProfile)
        .set(profileObj)
        .where(eq(userProfile.id, pRow.id));
    } else {
      await db.insert(userProfile).values(profileObj);
    }

    // 2. Initialize Skills if provided
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
      await db.delete(skills);
      const categoryMap: Record<string, string> = {
        Photoshop: "Design",
        Illustrator: "Design",
        "After Effects": "Video & Motion",
        "Premiere Pro": "Video & Motion",
        Lightroom: "Design",
        Canva: "Design",
        Figma: "Design",
        "UI Design": "Design",
        "Web Development": "Tech",
        "3D": "Video & Motion",
        Animation: "Video & Motion",
        Marketing: "Business",
        Sales: "Business",
        Writing: "Business",
      };

      const levelXpMap: Record<string, { xp: number; rank: string; idx: number }> = {
        Beginner: { xp: 0, rank: "Creative Beginner", idx: 1 },
        Intermediate: { xp: 500, rank: "Creative Explorer", idx: 2 },
        Advanced: { xp: 1000, rank: "Creative Professional", idx: 3 },
        Professional: { xp: 1600, rank: "Creative Master", idx: 5 },
      };

      const insertSkills = data.skills.map((sk: { name: string; level: string }) => {
        const cat = categoryMap[sk.name] || "Design";
        const lvlInfo = levelXpMap[sk.level] || levelXpMap["Beginner"];
        return {
          name: sk.name,
          category: cat,
          currentXp: lvlInfo.xp,
          level: lvlInfo.rank,
          levelIndex: lvlInfo.idx,
          iconName: "Sparkles",
          tasksCompletedCount: 0,
        };
      });
      await db.insert(skills).values(insertSkills);
    }

    // 3. Initialize Goals if provided
    if (data.goals && Array.isArray(data.goals) && data.goals.length > 0) {
      await db.delete(goals);
      const insertGoals = data.goals.map((gText: string) => ({
        title: gText,
        category: "Career",
        targetValue: 100,
        currentValue: 0,
        unit: "%",
        completed: false,
      }));
      await db.insert(goals).values(insertGoals);
    }

    // 4. Update Future Room Vision & Why I Started
    if (data.visionText) {
      const configRows = await db.select().from(futureRoomConfig);
      const existingCfg = configRows[0];
      const customLetter = `Dear ${newName},\n\nThank you for refusing to quit.\n\nThe mornings you wanted to stay in bed...\nThe nights you kept practicing...\nThe projects nobody noticed...\n\nThey changed everything.\n\nYou now own the studio you once dreamed about.\nClients respect your work.\nYour family is proud.\n\nKeep going.\nI'm waiting for you.`;

      if (existingCfg) {
        await db
          .update(futureRoomConfig)
          .set({
            whyIStarted: data.visionText,
            letterFromFuture: customLetter,
            updatedAt: new Date(),
          })
          .where(eq(futureRoomConfig.id, existingCfg.id));
      } else {
        await db.insert(futureRoomConfig).values({
          whyIStarted: data.visionText,
          letterFromFuture: customLetter,
        });
      }
    }

    // 5. Initialize Signed Promise
    if (data.promiseText && data.promiseSignature) {
      await db.delete(userPromise);
      await db.insert(userPromise).values({
        isSigned: true,
        promiseText: data.promiseText,
        whoFor: JSON.stringify(["Myself", "My family", "My dreams"]),
        whatIfQuit:
          "I'll remain stuck. I'll never build my business. I'll waste my potential. I'll regret not trying.",
        whatIfConsistent:
          "Financial freedom. Creative confidence. Helping my family. Owning my studio. Working with dream clients. Building a meaningful life.",
        signatureName: data.promiseSignature,
        signedDate: todayStr,
      });

      // Add to promise wall milestones
      await db.delete(promiseWallMilestones);
      await db.insert(promiseWallMilestones).values({
        title: "Signed the Promise",
        date: todayStr,
        category: "promise",
        orderIndex: 1,
      });
    }

    return NextResponse.json({
      success: true,
      message: "ATLAS OS multi-user onboarding data saved to database successfully",
    });
  } catch (err: any) {
    console.error("Error saving onboarding:", err);
    return NextResponse.json(
      { error: "Failed to save onboarding data", details: err.message },
      { status: 500 }
    );
  }
}
