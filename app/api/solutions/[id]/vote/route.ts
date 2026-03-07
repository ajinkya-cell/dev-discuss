import { db } from "@/db";
import { solutions } from "@/db/schema/solutions";
import { solutionVotes } from "@/db/schema/solutionVotes";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
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

      const existingVote = await db
       .select()
       .from(solutionVotes)
       .where(
        and(eq(solutionVotes.solutionId , id),
        (eq(solutionVotes.userId , userId))
    )
       )

       if(existingVote.length){
        await db
         .delete(solutionVotes)
         .where(
            and(
                eq(solutionVotes.solutionId , id),
                eq(solutionVotes.userId , userId)
            )
         );

         return NextResponse.json({
            message : " Vote removed"
         })
       }

       await db
        .insert(solutionVotes)
        .values({
            userId , 
            solutionId:id
        })

        return NextResponse.json({
            message : "Vote added"
        })
    } catch (error) {
        return NextResponse.json({
            error : " voting failed"
        } , {status : 500})
    }
}