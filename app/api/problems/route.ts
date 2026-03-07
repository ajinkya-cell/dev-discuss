import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { createProblemSchema } from "@/lib/validators/problem.schema";
import { NextResponse } from "next/server";
import { count, sql } from "drizzle-orm";

export async function POST(req: Request) {

  try {

    const userId = await getUserFromToken();

    if (!userId)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json();

    const data = createProblemSchema.parse(body);

    const [problem] = await db
      .insert(problems)
      .values({
        title: data.title,
        description: data.description,
        tags: data.tags,
        authorId: userId
      })
      .returning();

    return NextResponse.json(problem, { status: 201 });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const tag = searchParams.get("tag");

    const offset = (page - 1) * limit;

    let data;
    let totalItems;

    if (tag) {

      data = await db
        .select()
        .from(problems)
        .where(sql`${tag} = ANY(${problems.tags})`)
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ value: count() })
        .from(problems)
        .where(sql`${tag} = ANY(${problems.tags})`);

      totalItems = totalResult[0].value;

    } else {

      data = await db
        .select()
        .from(problems)
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ value: count() })
        .from(problems);

      totalItems = totalResult[0].value;

    }

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      tag: tag ?? null,
      data
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}