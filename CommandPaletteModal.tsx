import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioProjects, calendarDays } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      thumbnail,
      description,
      toolsUsed,
      completionDate,
      client,
      behanceLink,
      liveWebsite,
      status,
    } = body;

    const todayStr = completionDate || new Date().toISOString().split("T")[0];

    const inserted = await db
      .insert(portfolioProjects)
      .values({
        title: title || "New Creative Project",
        category: category || "UI Design",
        thumbnail:
          thumbnail ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        description: description || "Project description and case study.",
        toolsUsed: toolsUsed || "Figma, Next.js, Framer Motion",
        completionDate: todayStr,
        client: client || "Personal Project",
        behanceLink: behanceLink || "https://behance.net",
        liveWebsite: liveWebsite || "https://example.com",
        status: status || "Completed",
      })
      .returning();

    // Increment calendar day projectsCompleted
    const calRows = await db
      .select()
      .from(calendarDays)
      .where(eq(calendarDays.date, todayStr));
    if (calRows.length > 0) {
      await db
        .update(calendarDays)
        .set({
          projectsCompleted: sql`projects_completed + 1`,
        })
        .where(eq(calendarDays.date, todayStr));
    }

    return NextResponse.json({ success: true, project: inserted[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
