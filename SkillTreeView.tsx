import React from "react";
import { checkAndSeed } from "@/db/ensure-seed";
import { AtlasApp } from "@/components/AtlasApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await checkAndSeed();

  return <AtlasApp />;
}
