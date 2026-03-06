import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { createProblemSchema } from "@/lib/validators/problem.schema";
import { NextResponse } from "next/server";

export async function POST(req : Request){
    try {
        const userId = await getUserFromToken();
        console.log("USER FROM TOKEN:", userId);
        if(!userId){
            return NextResponse.json({
                error : "Unauthorized"
                
            },{status : 401})
        }

        const body = await req.json();
        const data = createProblemSchema.parse(body);

        const [problem] = await db
         .insert(problems)
         .values({
            title:data.title,
            description:data.description,
            tags:data.tags,
            authorId:userId
         })
         .returning()

         return NextResponse.json(problem , {status:201});
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            {
                error : "failed to create problem"
            },{
                status : 500
            }
        )
    }
}

export async function GET(){
    try {
        const result = await db.select().from(problems);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json ({
            error : " failed to fetch problem"
        }, {
            status : 500
        })
    }
}

