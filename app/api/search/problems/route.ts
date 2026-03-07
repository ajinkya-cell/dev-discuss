import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || !q.trim())
      return NextResponse.json([]);

    const query = q.trim();
    // Create a pattern for ILIKE matching (partial/substring match)
    const likePattern = `%${query}%`;

    // Hybrid search strategy:
    // 1. Full-text search on title + description (for word-stem matching)
    // 2. ILIKE on title (for partial/substring matching like "Next" matching "Next.js")
    // 3. ILIKE on description (for partial content matching)
    // 4. Tag matching — check if any tag contains the query (case-insensitive)
    //
    // Results are scored: full-text matches rank highest, then title matches,
    // then tag matches, then description matches.

    const rows = await db.execute(sql`
      SELECT DISTINCT ON (id)
        id,
        title,
        description,
        tags,
        author_id,
        created_at,
        (
          CASE
            -- Full-text match on title+description gets highest score
            WHEN to_tsvector('english', title || ' ' || description)
                 @@ plainto_tsquery('english', ${query})
            THEN 10 + ts_rank(
              to_tsvector('english', title || ' ' || description),
              plainto_tsquery('english', ${query})
            )
            ELSE 0
          END
          +
          CASE
            -- Exact substring in title
            WHEN title ILIKE ${likePattern} THEN 8
            ELSE 0
          END
          +
          CASE
            -- Tag match: any tag contains the query
            WHEN EXISTS (
              SELECT 1 FROM unnest(tags) AS t
              WHERE t ILIKE ${likePattern}
            ) THEN 6
            ELSE 0
          END
          +
          CASE
            -- Substring in description
            WHEN description ILIKE ${likePattern} THEN 2
            ELSE 0
          END
        ) AS relevance

      FROM problems

      WHERE
        -- At least one of these must match
        to_tsvector('english', title || ' ' || description)
          @@ plainto_tsquery('english', ${query})
        OR title ILIKE ${likePattern}
        OR description ILIKE ${likePattern}
        OR EXISTS (
          SELECT 1 FROM unnest(tags) AS t
          WHERE t ILIKE ${likePattern}
        )

      ORDER BY id, relevance DESC

      LIMIT 30
    `);

    // Re-sort by relevance (DISTINCT ON requires ORDER BY id first)
    const sorted = (rows.rows as any[]).sort((a, b) => Number(b.relevance) - Number(a.relevance));

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}