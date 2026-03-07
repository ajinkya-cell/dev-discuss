import { db } from "@/db"
import { users } from "@/db/schema/users"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
    req : Request,
    context : {params : Promise<{id : string}>}
){
    try {
        const { id } = await context.params

        const result = await db
         .select({
            id : users.id,
            name : users.name,
            email : users.email,
            createdAt : users.createdAt
         })
         .from(users)
         .where(eq(users.id , id))

        if (!result.length)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      ); 
      return NextResponse.json(result)
    } catch (error) {
       return NextResponse.json(
         {error : " failed to fetch user"},
        {status : 500}
       )
    }
}