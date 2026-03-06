import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { problemVotes } from "@/db/schema/problemVotes";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
         return NextResponse.json({
            message : "vote removed"
         })
       }

       await db.insert(problemVotes).values({
        userId ,
        problemId:id
       })

       return NextResponse.json({
        message:"Vote added"
       })
    }catch(error){
        console.error(error);

        return NextResponse.json(
            {error : "Voting in problem failed"},
            {status : 500}
        )
    }
}