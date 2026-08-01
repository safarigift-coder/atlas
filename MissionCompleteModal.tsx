import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userPromise } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      promiseText,
      whoFor,
      whatIfQuit,
      whatIfConsistent,
      signatureName,
      signedDate,
      isSigned,
    } = body;

    const rows = await db.select().from(userPromise);
    const existing = rows[0];

    const updateObj: any = {
      updatedAt: new Date(),
    };

    if (promiseText !== undefined) updateObj.promiseText = promiseText;
    if (whoFor !== undefined) updateObj.whoFor = JSON.stringify(whoFor);
    if (whatIfQuit !== undefined) updateObj.whatIfQuit = whatIfQuit;
    if (whatIfConsistent !== undefined)
      updateObj.whatIfConsistent = whatIfConsistent;
    if (signatureName !== undefined) updateObj.signatureName = signatureName;
    if (signedDate !== undefined) updateObj.signedDate = signedDate;
    if (isSigned !== undefined) updateObj.isSigned = isSigned;

    if (action === "sign") {
      updateObj.isSigned = true;
      if (!updateObj.signedDate) {
        updateObj.signedDate = new Date().toISOString().split("T")[0];
      }
    } else if (action === "reset") {
      updateObj.isSigned = false;
    }

    let updated;
    if (existing) {
      updated = await db
        .update(userPromise)
        .set(updateObj)
        .where(eq(userPromise.id, existing.id))
        .returning();
    } else {
      updated = await db
        .insert(userPromise)
        .values({
          isSigned: updateObj.isSigned ?? true,
          promiseText: updateObj.promiseText,
          whoFor: updateObj.whoFor,
          whatIfQuit: updateObj.whatIfQuit,
          whatIfConsistent: updateObj.whatIfConsistent,
          signatureName: updateObj.signatureName || "Creator",
          signedDate: updateObj.signedDate || new Date().toISOString().split("T")[0],
        })
        .returning();
    }

    const c = updated[0];
    return NextResponse.json({
      success: true,
      promiseState: {
        id: c.id,
        isSigned: c.isSigned,
        promiseText: c.promiseText,
        whoFor: JSON.parse(c.whoFor),
        whatIfQuit: c.whatIfQuit,
        whatIfConsistent: c.whatIfConsistent,
        signatureName: c.signatureName,
        signedDate: c.signedDate,
      },
    });
  } catch (err: any) {
    console.error("Error saving promise:", err);
    return NextResponse.json(
      { error: "Failed to save Promise", details: err.message },
      { status: 500 }
    );
  }
}
