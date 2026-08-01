import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  futureRoomConfig,
  identityStatements,
  dreamTimeline,
  visionBoardItems,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { checkAndSeed } from "@/db/ensure-seed";

export async function GET() {
  try {
    await checkAndSeed();

    const configRows = await db.select().from(futureRoomConfig);
    let config = configRows[0];

    if (!config) {
      const inserted = await db
        .insert(futureRoomConfig)
        .values({})
        .returning();
      config = inserted[0];
    }

    const statements = await db
      .select()
      .from(identityStatements)
      .orderBy(identityStatements.orderIndex);

    const timeline = await db
      .select()
      .from(dreamTimeline)
      .orderBy(dreamTimeline.year);

    const allVision = await db.select().from(visionBoardItems);

    return NextResponse.json({
      config: {
        id: config.id,
        letterFromFuture: config.letterFromFuture,
        whyIStarted: config.whyIStarted,
        costOfQuitting: JSON.parse(config.costOfQuitting),
        rewardOfConsistency: JSON.parse(config.rewardOfConsistency),
        legacyTraits: JSON.parse(config.legacyTraits),
        studioItems: JSON.parse(config.studioItems),
      },
      identityStatements: statements,
      dreamTimeline: timeline.map((t) => ({
        ...t,
        milestones: JSON.parse(t.milestones),
      })),
      visionBoardItems: allVision,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch Future Room data", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const configRows = await db.select().from(futureRoomConfig);
    const existing = configRows[0];

    const updateObj: any = {
      updatedAt: new Date(),
    };

    if (body.letterFromFuture !== undefined)
      updateObj.letterFromFuture = body.letterFromFuture;
    if (body.whyIStarted !== undefined)
      updateObj.whyIStarted = body.whyIStarted;
    if (body.costOfQuitting !== undefined)
      updateObj.costOfQuitting = JSON.stringify(body.costOfQuitting);
    if (body.rewardOfConsistency !== undefined)
      updateObj.rewardOfConsistency = JSON.stringify(body.rewardOfConsistency);
    if (body.legacyTraits !== undefined)
      updateObj.legacyTraits = JSON.stringify(body.legacyTraits);
    if (body.studioItems !== undefined)
      updateObj.studioItems = JSON.stringify(body.studioItems);

    let updated;
    if (existing) {
      updated = await db
        .update(futureRoomConfig)
        .set(updateObj)
        .where(eq(futureRoomConfig.id, existing.id))
        .returning();
    } else {
      updated = await db
        .insert(futureRoomConfig)
        .values(updateObj)
        .returning();
    }

    const c = updated[0];
    return NextResponse.json({
      success: true,
      config: {
        id: c.id,
        letterFromFuture: c.letterFromFuture,
        whyIStarted: c.whyIStarted,
        costOfQuitting: JSON.parse(c.costOfQuitting),
        rewardOfConsistency: JSON.parse(c.rewardOfConsistency),
        legacyTraits: JSON.parse(c.legacyTraits),
        studioItems: JSON.parse(c.studioItems),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to save Future Room data", details: err.message },
      { status: 500 }
    );
  }
}
