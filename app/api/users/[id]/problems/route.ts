import { db } from "@/db";
import { problems } from "@/db/schema/problems";
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
      .from(problems)
      .where(eq(problems.authorId, id));

    return NextResponse.json(result);

  } catch {

    return NextResponse.json(
      { error: "Failed to fetch user problems" },
      { status: 500 }
    );
  }
}