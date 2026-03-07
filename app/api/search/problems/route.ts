import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q");

    if (!q)
      return NextResponse.json([]);

    const rows = await db.execute(sql`

      SELECT
        id,
        title,
        description,
        tags,

        ts_rank(
          to_tsvector('english', title || ' ' || description),
          plainto_tsquery('english', ${q})
        ) AS rank

      FROM problems

      WHERE
        to_tsvector('english', title || ' ' || description)
        @@ plainto_tsquery('english', ${q})

      ORDER BY rank DESC

      LIMIT 20

    `);

    return NextResponse.json(rows.rows);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}