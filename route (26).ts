import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { incomeTransactions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    await db.delete(incomeTransactions).where(eq(incomeTransactions.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
