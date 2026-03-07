import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { problemVotes } from "@/db/schema/problemVotes";
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
            .from(problemVotes)
            .where(eq(problemVotes.problemId, id));

        const totalVotes = voteResult?.value || 0;

        // Check if current user has voted
        let hasVoted = false;
        const userId = await getUserFromToken();
        if (userId) {
            const existing = await db
                .select()
                .from(problemVotes)
                .where(
                    and(
                        eq(problemVotes.problemId, id),
                        eq(problemVotes.userId, userId)
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
    try{
        const userId = await getUserFromToken();

        if(!userId)
            return NextResponse.json(
        {
            error : "Unauthorized"
        },{
            status : 401
        });

        const { id } = await context.params

        const problem = await db
         .select()
         .from(problems)
         .where(eq(problems.id , id))

        if (!problem.length)
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      ); 

      const existingVote = await db
       .select()
       .from(problemVotes)
       .where(
        and(eq(problemVotes.problemId , id),
        eq(problemVotes.userId , userId)
    )
       )
       if(existingVote.length){
        await db
         .delete(problemVotes)
         .where(
            and(
                eq(problemVotes.problemId , id),
                eq(problemVotes.userId , userId)
            )
         );

         // Get updated count
         const [voteResult] = await db
             .select({ value: count() })
             .from(problemVotes)
             .where(eq(problemVotes.problemId, id));

         return NextResponse.json({
            message : "vote removed",
            votes: voteResult?.value || 0,
            hasVoted: false
         })
       }

       await db.insert(problemVotes).values({
        userId ,
        problemId:id
       })

       // Get updated count
       const [voteResult] = await db
           .select({ value: count() })
           .from(problemVotes)
           .where(eq(problemVotes.problemId, id));

       return NextResponse.json({
        message:"Vote added",
        votes: voteResult?.value || 0,
        hasVoted: true
       })
    }catch(error){
        console.error(error);

        return NextResponse.json(
            {error : "Voting in problem failed"},
            {status : 500}
        )
    }
}