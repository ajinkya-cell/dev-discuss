import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");

    if (!tag || !tag.trim())
      return NextResponse.json([]);

    const query = tag.trim();

    // Find all problems that have this tag in their tags array (case-insensitive)
    const rows = await db.execute(sql`
      SELECT
        id,
        title,
        description,
        tags,
        author_id,
        created_at
      FROM problems
      WHERE EXISTS (
        SELECT 1 FROM unnest(tags) AS t
        WHERE LOWER(t) = LOWER(${query})
      )
      ORDER BY created_at DESC
      LIMIT 50
    `);

    return NextResponse.json(rows.rows);
  } catch (error) {
    console.error("Failed to fetch problems by tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems by tag" },
      { status: 500 }
    );
  }
}
