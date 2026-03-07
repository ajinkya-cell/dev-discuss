import { db } from "@/db";
import { solutions } from "@/db/schema/solutions";
import { solutionVotes } from "@/db/schema/solutionVotes";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { and, count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Get total vote count
        const [voteResult] = await db
            .select({ value: count() })
            .from(solutionVotes)
            .where(eq(solutionVotes.solutionId, id));

        const totalVotes = voteResult?.value || 0;

        // Check if current user has voted
        let hasVoted = false;
        const userId = await getUserFromToken();
        if (userId) {
            const existing = await db
                .select()
                .from(solutionVotes)
                .where(
                    and(
                        eq(solutionVotes.solutionId, id),
                        eq(solutionVotes.userId, userId)
                    )
                );
            hasVoted = existing.length > 0;
        }

        return NextResponse.json({ votes: totalVotes, hasVoted });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch votes" },
            { status: 500 }
        );
    }
}

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

         // Get updated count
         const [voteResult] = await db
             .select({ value: count() })
             .from(solutionVotes)
             .where(eq(solutionVotes.solutionId, id));

         return NextResponse.json({
            message : "Vote removed",
            votes: voteResult?.value || 0,
            hasVoted: false
         })
       }

       await db
        .insert(solutionVotes)
        .values({
            userId , 
            solutionId:id
        })

        // Get updated count
        const [voteResult] = await db
            .select({ value: count() })
            .from(solutionVotes)
            .where(eq(solutionVotes.solutionId, id));

        return NextResponse.json({
            message : "Vote added",
            votes: voteResult?.value || 0,
            hasVoted: true
        })
    } catch (error) {
        return NextResponse.json({
            error : "voting failed"
        } , {status : 500})
    }
}