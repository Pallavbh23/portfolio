import { NextResponse } from "next/server";
import { fetchRepos } from "@/lib/github";

// API route removed for static export. Keeping file empty or commented could cause module errors; this stub returns 404.
export async function GET() {
  return NextResponse.json({ error: "API disabled in static export" }, { status: 404 });
}
