import { db } from "@/db";
import { solutions } from "@/db/schema/solutions";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(

  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {
    let { id } = await context.params;

    if (id === "me") {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      id = decoded.id;
    }

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