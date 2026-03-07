import { db } from "@/db";
import { solutions } from "@/db/schema/solutions";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { updateSolutionSchema } from "@/lib/validators/solution.schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { solutionVotes } from "@/db/schema/solutionVotes";

export async function PATCH(
    req : Request ,
    context : {params : Promise<{id : string}>}
){
    try {
        const userId = await getUserFromToken()
        if (!userId)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

      const {id} = await context.params

      const solution = await db
       .select()
       .from(solutions)
       .where(eq(solutions.id , id))

       if (!solution.length)
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 }
      );

      if(solution[0].authorId !== userId){
        return NextResponse.json(
            {error : "forbiddern"},{
                status : 403
            }
        )
      }

      const body = await req.json()
      const data = updateSolutionSchema.parse(body)

      const updated = await db
      .update(solutions)
      .set({
        ...data,
        updatedAt : new Date
      })
      .where(eq(solutions.id , id))
      .returning()

      return NextResponse.json(updated[0])
    } catch (error) {
        return NextResponse.json({
            error : "Failed to update solution"

        },{
            status : 500
        })
    }
}

export async function DELETE(
    req:Request ,
    context : {params : Promise<{id : string}>}
){
    try {
        const userId = await getUserFromToken()
    if (!userId)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await context.params;

    const solution = await db
     .select()
     .from(solutions)
     .where(eq(solutions.id , id))

     if (!solution.length)
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 }
      );

     if(solution[0].authorId !== userId){
        return NextResponse.json(
            {error : "forbidden"},{
                status : 403
            }
        )
     } 

     await db.delete(solutionVotes).where(eq(solutionVotes.solutionId, id));

     await db
     .delete(solutions)
     .where(eq(solutions.id , id))

      return NextResponse.json({
      message: "Solution deleted"
    });
    } catch (error) {
        return NextResponse.json({
            error : "failed to delete solution"
        },{
            status : 500
        })
    }
}