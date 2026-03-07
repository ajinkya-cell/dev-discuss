import { db } from "@/db";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET(){
    try {
        const result = await db.execute(sql`
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                (COALESCE(p.problem_count, 0) * 5 + 
                 COALESCE(s.solution_count, 0) * 10 + 
                 COALESCE(f.follower_count, 0) * 2)::int AS reputation
            FROM users u
            LEFT JOIN (
                SELECT author_id, COUNT(*)::int as problem_count FROM problems GROUP BY author_id
            ) p ON u.id = p.author_id
            LEFT JOIN (
                SELECT author_id, COUNT(*)::int as solution_count FROM solutions GROUP BY author_id
            ) s ON u.id = s.author_id
            LEFT JOIN (
                SELECT following_id, COUNT(*)::int as follower_count FROM follows GROUP BY following_id
            ) f ON u.id = f.following_id
            ORDER BY reputation DESC
            LIMIT 10
        `);
        
        const usersList = result.rows || result;
        return NextResponse.json(usersList);
    } catch (error: any) {
        console.error("DEBUG_SQL_ERROR:", error.message);
        return NextResponse.json(
            {error : "failed to fetch users", details: error.message},
            {status : 500}
        )
    }
}