import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

type MemberRow = {
  id: number;
  name: string;
  xp: number;
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
  const members = await sql<MemberRow[]>`
    select id, name, xp
    from members
    order by xp desc, name asc
  `;

  return NextResponse.json(members);
}