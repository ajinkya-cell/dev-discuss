import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { solutions } from "@/db/schema/solutions";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { createSolutionSchema } from "@/lib/validators/solution.schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req:Request ,
    context : {params : Promise<{id : string}>}
){
    try {
        const userId = await getUserFromToken()
        if (!userId) { 
            return NextResponse.json({
                error : "Unauthorised"
            },{
                status : 401
            })
        }

        const {id} = await context.params
        const problem =await db
         .select()
         .from(problems)
         .where(eq(problems.id , id))
        
        if (!problem.length){
            return NextResponse.json({
                error : "problem not found"
            },{
                status : 404
            })
        }

        const body = await req.json()
        const data = createSolutionSchema.parse(body)

        const [solution] = await db
         .insert(solutions)
         .values({
            content:data.content,
            problemId : id,
            authorId :userId
         }).returning()

         return NextResponse.json(solution, {status:201})
    } catch (error) {
        return NextResponse.json(
            {error : "failed to create the solution"},{
                status : 500
            }
        )
    }
}

export async function GET(
    req : Request ,
    context : {params : Promise<{id : string}>}
){
    try {
        const {id} = await context.params

        const result = await db
         .select()
         .from(solutions)
         .where(eq(solutions.problemId , id))

        return NextResponse.json(result) 
    } catch (error) {
        return NextResponse.json(
            {error : "failed to fetch solutions"},
            {status : 500}
        )
    }
}