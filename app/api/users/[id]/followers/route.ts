import { db } from "@/db";
import { follows } from "@/db/schema/follows";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req:Request,
    context:{params : Promise<{id :string}>}
){
    try{
        const {id} = await context.params;
        const result = await db 
         .select()
         .from(follows)
         .where(eq(follows.followingId , id))

         return NextResponse.json(result)
    }catch(error){
        return NextResponse.json({
            error : "failed to fetch the folllowers"
        },{
            status : 500
        })
    }
}