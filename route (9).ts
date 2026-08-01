import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(clients).orderBy(desc(clients.createdAt));
    return NextResponse.json(all);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      business,
      phone,
      email,
      services,
      price,
      deadline,
      status,
      notes,
    } = body;

    const inserted = await db
      .insert(clients)
      .values({
        name: name || "New Client",
        business: business || "Company",
        phone: phone || "+1 (000) 000-0000",
        email: email || "client@company.com",
        services: services || "Design & Dev",
        price: Number(price) || 1500,
        deadline: deadline || new Date().toISOString().split("T")[0],
        status: status || "Lead",
        notes: notes || "",
      })
      .returning();

    return NextResponse.json({ success: true, client: inserted[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
