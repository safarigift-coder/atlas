import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clients, incomeTransactions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    const body = await req.json();

    const updated = await db
      .update(clients)
      .set({
        ...body,
      })
      .where(eq(clients.id, id))
      .returning();

    // If client status changed to "Paid", automatically log an income transaction if not already logged
    if (body.status === "Paid" && updated[0]) {
      const todayStr = new Date().toISOString().split("T")[0];
      await db.insert(incomeTransactions).values({
        date: todayStr,
        clientId: updated[0].id,
        clientName: updated[0].business || updated[0].name,
        amount: updated[0].price,
        service: updated[0].services,
        status: "Paid",
      });
    }

    return NextResponse.json({ success: true, client: updated[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    await db.delete(clients).where(eq(clients.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
