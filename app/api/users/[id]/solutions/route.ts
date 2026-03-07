import { db } from "@/db";
import { solutions } from "@/db/schema/solutions";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;

    const result = await db
      .select()
      .from(solutions)
      .where(eq(solutions.authorId, id));

    return NextResponse.json(result);

  } catch {

    return NextResponse.json(
      { error: "Failed to fetch user solutions" },
      { status: 500 }
    );
  }
}