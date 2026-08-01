import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { motivationalQuotes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, quote, author, id } = body;

    if (action === "rotate") {
      const all = await db.select().from(motivationalQuotes);
      if (all.length === 0) {
        return NextResponse.json({ error: "No quotes available" }, { status: 404 });
      }

      // Clear activeForToday
      for (const q of all) {
        await db
          .update(motivationalQuotes)
          .set({ activeForToday: false })
          .where(eq(motivationalQuotes.id, q.id));
      }

      const activeIndex = all.findIndex((q) => q.activeForToday);
      const nextIndex = (activeIndex + 1) % all.length;
      const nextQuote = all[nextIndex];

      await db
        .update(motivationalQuotes)
        .set({ activeForToday: true })
        .where(eq(motivationalQuotes.id, nextQuote.id));

      return NextResponse.json({ success: true, quote: nextQuote });
    }

    if (action === "add") {
      const inserted = await db
        .insert(motivationalQuotes)
        .values({
          quote: quote || "Action cures fear.",
          author: author || "ATLAS OS",
          activeForToday: false,
        })
        .returning();
      return NextResponse.json({ success: true, quote: inserted[0] });
    }

    if (action === "delete") {
      await db
        .delete(motivationalQuotes)
        .where(eq(motivationalQuotes.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
