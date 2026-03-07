import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const result = await db.execute(
            sql`
            SELECT DISTINCT UNNEST(${problems.tags}) AS tag
            FROM ${problems}
            ORDER BY tag
            `
        );

        const tags = result.rows.map((row : any)=>row.tag)
        return NextResponse.json(tags)
    } catch (error) {
       console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );  
    }
}