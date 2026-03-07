import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { problemVotes } from "@/db/schema/problemVotes";
import { solutions } from "@/db/schema/solutions";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const result = await db.execute(sql`

      SELECT
        p.id,
        p.title,
        p.description,
        p.tags,
        p.created_at,

        COUNT(DISTINCT pv.id) AS votes,
        COUNT(DISTINCT s.id) AS solutions,

        (
          COUNT(DISTINCT pv.id) * 3 +
          COUNT(DISTINCT s.id) * 2 +
          (EXTRACT(EPOCH FROM NOW() - p.created_at) / -3600)
        ) AS score

      FROM problems p

      LEFT JOIN problem_votes pv
      ON pv.problem_id = p.id

      LEFT JOIN solutions s
      ON s.problem_id = p.id

      GROUP BY p.id

      ORDER BY score DESC

      LIMIT 20

    `);

    return NextResponse.json(result.rows);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch trending problems" },
      { status: 500 }
    );
  }
}