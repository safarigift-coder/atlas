import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { incomeTransactions, calendarDays } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, clientId, clientName, amount, service, status } = body;
    const todayStr = date || new Date().toISOString().split("T")[0];

    const inserted = await db
      .insert(incomeTransactions)
      .values({
        date: todayStr,
        clientId: clientId || null,
        clientName: clientName || "Client Project",
        amount: Number(amount) || 0,
        service: service || "Creative Design",
        status: status || "Paid",
      })
      .returning();

    // If Paid, update calendar income for that date
    if (status === "Paid") {
      const calRows = await db
        .select()
        .from(calendarDays)
        .where(eq(calendarDays.date, todayStr));
      if (calRows.length > 0) {
        await db
          .update(calendarDays)
          .set({
            incomeEarned: sql`income_earned + ${Number(amount) || 0}`,
          })
          .where(eq(calendarDays.date, todayStr));
      }
    }

    return NextResponse.json({ success: true, transaction: inserted[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
