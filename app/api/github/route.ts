import { NextResponse } from "next/server";
import { fetchRepos } from "@/lib/github";

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "Pallavbh23";
  try {
    const data = await fetchRepos(username);
    // return raw array because ProjectsGrid expects data.map(...)
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
