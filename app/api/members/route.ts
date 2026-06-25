import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

type MemberRow = {
  id: number;
  name: string;
  lifetime_xp: number;
  current_xp: number;
};

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured." },
      { status: 500 },
    );
  }

  const sql = neon(databaseUrl);
  const members = (await sql`
    select id, name, lifetime_xp, coalesce(current_xp, 0) as current_xp
    from members
    order by coalesce(current_xp, 0) desc, lifetime_xp desc, name asc
  `) as MemberRow[];

  return NextResponse.json(members);
}