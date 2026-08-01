import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  userProfile,
  userPromise,
  goals,
  portfolioProjects,
  clients,
  skills,
  achievements,
  futureRoomConfig,
  identityStatements,
  dreamTimeline,
  legacyEntries,
} from "@/db/schema";
import { checkAndSeed } from "@/db/ensure-seed";

export async function GET() {
  try {
    await checkAndSeed();

    const profileRows = await db.select().from(userProfile);
    const pRow = profileRows[0] || {};
    const profile = {
      name:
        pRow.preferredName || pRow.firstName || pRow.name || "Gift Safari",
      title: pRow.occupation || pRow.title || "Creative Entrepreneur",
      streak: pRow.currentStreak || 0,
      xp: pRow.xp || 0,
      level: pRow.level || 1,
      levelTitle: pRow.levelTitle || "Creative Apprentice",
      photo:
        pRow.profilePhotoUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    };

    const promiseRows = await db.select().from(userPromise);
    const prom = promiseRows[0] || {
      promiseText:
        "I promise that I will show up every single day, build my creative portfolio, and honor the vision I have for my family and my future. I refuse to settle for an ordinary life.",
      signatureName: "Gift Safari",
      signedDate: "2026-03-01",
    };

    const allGoals = await db.select().from(goals);
    const allProjects = await db.select().from(portfolioProjects);
    const allSkills = await db.select().from(skills);
    const allAchievements = await db.select().from(achievements);
    const allIdentity = await db.select().from(identityStatements);
    const allTimeline = await db.select().from(dreamTimeline);

    const nowStr = new Date().toISOString().split("T")[0];

    const htmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ATLAS OS — Executive Profile & Report (${profile.name})</title>
  <style>
    :root {
      --bg: #09090B;
      --card: #121215;
      --surface: #18181B;
      --border: #27272A;
      --text: #F4F4F5;
      --muted: #A1A1AA;
      --accent: #10B981;
      --blue: #3B82F6;
      --purple: #A855F7;
      --orange: #F97316;
      --gold: #F59E0B;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      line-height: 1.6;
      padding: 40px 20px;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-svg {
      width: 48px;
      height: 48px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    h1 {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin-top: 8px;
    }
    h2 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 16px;
      color: var(--text);
    }
    p {
      color: var(--muted);
      font-size: 14px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
    }
    .metric-val {
      font-size: 28px;
      font-weight: 900;
      color: var(--accent);
      margin-top: 8px;
    }
    .promise-card {
      background: linear-gradient(135deg, #121215 0%, #171c19 100%);
      border: 2px solid rgba(16, 185, 129, 0.4);
      border-radius: 24px;
      padding: 32px;
      margin-bottom: 32px;
    }
    .promise-quote {
      font-family: Georgia, serif;
      font-size: 20px;
      font-style: italic;
      color: #FFF;
      line-height: 1.8;
      margin: 20px 0;
      padding: 20px;
      background: rgba(0,0,0,0.4);
      border-radius: 16px;
      border-left: 4px solid var(--accent);
    }
    .signature-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      font-size: 13px;
      color: var(--muted);
    }
    .signature-val {
      font-family: Georgia, serif;
      font-size: 20px;
      font-weight: bold;
      color: var(--accent);
    }
    .section {
      margin-bottom: 32px;
    }
    .list-item {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item-title {
      font-weight: 700;
      color: #FFF;
      font-size: 15px;
    }
    .item-meta {
      font-size: 12px;
      color: var(--muted);
      margin-top: 4px;
    }
    .pill {
      font-size: 11px;
      font-weight: bold;
      padding: 4px 10px;
      border-radius: 8px;
      background: var(--surface);
      color: var(--accent);
    }
    .footer {
      text-align: center;
      padding-top: 40px;
      border-top: 1px solid var(--border);
      color: var(--muted);
      font-size: 13px;
    }
    @media print {
      body {
        background: #FFF;
        color: #000;
        padding: 0;
      }
      .card, .header, .promise-card, .list-item {
        background: #FFF !important;
        color: #000 !important;
        border-color: #DDD !important;
        box-shadow: none !important;
      }
      .promise-quote {
        background: #F8F9FA !important;
        color: #000 !important;
      }
      .metric-val, .badge, .signature-val {
        color: #059669 !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <svg class="logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10L90 85H10L50 10Z" fill="#10B981" />
          <path d="M50 10L70 85H50V10Z" fill="#18181B" fill-opacity="0.45" />
          <path d="M50 35L62 65H38L50 35Z" fill="#09090B" />
        </svg>
        <div>
          <span class="badge">ATLAS OS EXECUTIVE REPORT</span>
          <h1>${profile.name}</h1>
          <p>${profile.title} • Generated on ${nowStr}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; font-weight: bold;">Current Rank</div>
        <div style="font-size: 18px; font-weight: 900; color: var(--gold);">Level ${
          profile.level
        } • ${profile.levelTitle}</div>
      </div>
    </div>

    <!-- 4 Key Metrics -->
    <div class="grid-4">
      <div class="card">
        <p style="font-weight: bold; text-transform: uppercase; font-size: 11px;">Current Streak</p>
        <div class="metric-val" style="color: var(--orange);">🔥 ${
          profile.streak
        } Days</div>
      </div>
      <div class="card">
        <p style="font-weight: bold; text-transform: uppercase; font-size: 11px;">Total RPG XP</p>
        <div class="metric-val" style="color: var(--gold);">⚡ ${profile.xp.toLocaleString()} XP</div>
      </div>
      <div class="card">
        <p style="font-weight: bold; text-transform: uppercase; font-size: 11px;">Portfolio Shipped</p>
        <div class="metric-val" style="color: var(--purple);">🎨 ${
          allProjects.length
        } Projects</div>
      </div>
      <div class="card">
        <p style="font-weight: bold; text-transform: uppercase; font-size: 11px;">Skills Mastered</p>
        <div class="metric-val" style="color: var(--blue);">⚡ ${
          allSkills.length
        } Skills</div>
      </div>
    </div>

    <!-- The Sacred Covenant (The Promise) -->
    <div class="promise-card">
      <span class="badge" style="background: rgba(16, 185, 129, 0.2);">THE SACRED COVENANT (THE PROMISE)</span>
      <div class="promise-quote">"${
        prom.promiseText ||
        "I promise that I will show up every single day, build my creative portfolio, and honor the vision I have for my family and my future."
      }"</div>
      <div class="signature-row">
        <div>
          <div>Digital Signature</div>
          <div class="signature-val">${
            prom.signatureName || profile.name
          }</div>
        </div>
        <div style="text-align: right;">
          <div>Date Signed</div>
          <div style="font-weight: bold; color: #FFF;">${
            prom.signedDate || "2026-03-01"
          }</div>
        </div>
      </div>
    </div>

    <!-- Identity Statements -->
    <div class="section">
      <h2>The Person I Am Becoming (Identity Statements)</h2>
      ${
        allIdentity.length > 0
          ? allIdentity
              .map(
                (idItem) => `
        <div class="list-item">
          <div class="item-title">"${idItem.statement}"</div>
          <span class="pill">Active Identity</span>
        </div>
      `
              )
              .join("")
          : `<div class="card"><p>No identity statements recorded yet.</p></div>`
      }
    </div>

    <!-- Active Strategic Goals -->
    <div class="section">
      <h2>Strategic Objectives & Goals</h2>
      ${
        allGoals.length > 0
          ? allGoals
              .map(
                (goal) => `
        <div class="list-item">
          <div>
            <div class="item-title">${goal.title}</div>
            <div class="item-meta">Category: ${goal.category} • Target: ${
                  goal.targetValue
                } ${goal.unit}</div>
          </div>
          <span class="pill">${goal.currentValue} / ${goal.targetValue} ${
                  goal.unit
                }</span>
        </div>
      `
              )
              .join("")
          : `<div class="card"><p>No goals recorded yet.</p></div>`
      }
    </div>

    <!-- Portfolio Gallery Case Studies -->
    <div class="section">
      <h2>Portfolio Case Studies Shipped</h2>
      ${
        allProjects.length > 0
          ? allProjects
              .map(
                (proj) => `
        <div class="list-item">
          <div>
            <div class="item-title">${proj.title}</div>
            <div class="item-meta">Client: ${proj.client} • Category: ${proj.category} • Completed: ${proj.completionDate}</div>
          </div>
          <span class="pill">${proj.status}</span>
        </div>
      `
              )
              .join("")
          : `<div class="card"><p>No portfolio case studies shipped yet.</p></div>`
      }
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>ATLAS OS</strong> — Personal Operating System of a Creative Entrepreneur</p>
      <p style="margin-top: 4px;">"The strongest contract you'll ever sign is the one you make with yourself."</p>
      <p style="margin-top: 12px; font-size: 11px;">Standalone Executive HTML Document • Printable to PDF</p>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="ATLAS_OS_EXECUTIVE_REPORT_${
          profile.name.replace(/\s+/g, "_")
        }.html"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to generate HTML report",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
