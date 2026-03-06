import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { updateProblemSchema } from "@/lib/validators/problem.schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET( req : Request , 
    context: { params: Promise<{ id: string }> }
){
    try {
        const { id } = await context.params;
        const result = await db
        .select()
        .from(problems)
        .where(eq(problems.id , id))

        if (!result.length){
            return NextResponse.json({
                error : "problem not found"
            },{
                status : 404
            })
        }

        return NextResponse.json(result[0])
    } catch (error) {
        return NextResponse.json({
            error : "specific problem not fetched"
        },{
            status : 409
        })
    }
}

export async function PATCH(
    req:Request , 
    
    context: {params : Promise<{id:string}>}
){
    try {
        const userId = await getUserFromToken()
        const {id} = await context.params
        if(!userId) return NextResponse.json(
            {error : "Unauthorized"},
            {status : 401}
        );

        const body = await req.json();
        const data = updateProblemSchema.parse(body)

        const problem =await db
        .select()
        .from(problems)
        .where(eq(problems.id , id));

        if(!problem.length){
            return NextResponse.json({
                error : "Problem not found"
            },{
                status : 409
            })
        }

        if(problem[0].authorId !== userId) return NextResponse.json({
            error : "forbidden"
        },{status : 405})

        const updated = await db
        .update(problems)
        .set({
            ...data,
            updatedAt: new Date()
        })
        .where(eq(problems.id , id))
        .returning();

        return NextResponse.json(updated[0])
    } catch (error) {
        return NextResponse.json(
            {error : "failed to update problem"},
            {status : 408}
        )
    }
}

export async function DELETE(
    req : Request ,
    context :{params :Promise<{id:string}> }
){
    try {
        const userId = await getUserFromToken();
        const {id} =await context.params
        if (!userId) return NextResponse.json({
            error : "Unauthorised"
        },{
            status : 409
        })

        const problem = await db
        .select()
        .from(problems)
        .where(eq(problems.id , id))

        if(!problem.length)
            return NextResponse.json({
        error : "tired of writing this if not happened then what shit"}
    ,{
        status : 469
    })

    if (problem[0].authorId !== userId){
        return NextResponse.json({
            error : "Unauthorized"
        },{
            status : 469
        })
    }

    await db
    .delete(problems)
    .where(eq(problems.id , id));

    return NextResponse.json({
        message : "Problem deleted successfully"
    })


    } catch (error) {
        return NextResponse.json({
            error : " so we failed while deleting the prolem"
        },{
            status :406
        })
    }
}