import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { identityStatements } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, statement, orderIndex } = body;

    if (action === "add") {
      const all = await db.select().from(identityStatements);
      const inserted = await db
        .insert(identityStatements)
        .values({
          statement: statement || "I build world-class work every day.",
          orderIndex: orderIndex || all.length + 1,
        })
        .returning();
      return NextResponse.json({ success: true, item: inserted[0] });
    }

    if (action === "update") {
      const updated = await db
        .update(identityStatements)
        .set({
          statement: statement,
        })
        .where(eq(identityStatements.id, Number(id)))
        .returning();
      return NextResponse.json({ success: true, item: updated[0] });
    }

    if (action === "delete") {
      await db
        .delete(identityStatements)
        .where(eq(identityStatements.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
