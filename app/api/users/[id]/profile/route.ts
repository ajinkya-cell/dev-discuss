import { db } from "@/db"
import { follows } from "@/db/schema/follows"
import { problems } from "@/db/schema/problems"
import { solutions } from "@/db/schema/solutions"
import { users } from "@/db/schema/users"
import { count, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
    req : Request,
    context : {params : Promise<{id :string}>}
){
    try {
        const {id} = await context.params

        const user = await db
         .select({
            id : users.id,
            name : users.name,
            email : users.email,
            createdAt : users.createdAt
         })
         .from(users)
         .where(eq(users.id , id))

        if(!user.length)
            return NextResponse.json(
        {error : "user not found"},
        {status : 404}
    )
     const problemCount = await db
      .select({value : count()})
      .from(problems)
      .where(eq(problems.authorId , id))

     const solutionCount = await db
     .select({value : count()})
     .from(solutions)
     .where(eq(solutions.authorId  , id))

     const followerCount = await db
     .select({value : count()})
     .from(follows)
     .where(eq(follows.followingId , id)) 

     const followingCount = await db
      .select({ value: count() })
      .from(follows)
      .where(eq(follows.followerId, id));

    return NextResponse.json({
        user : user[0],
        stats : {
            problems : problemCount[0].value,
            solutions : solutionCount[0].value,
            followers : followerCount[0].value,
            following : followingCount[0].value
        }
    })  
    } catch (error) {
       console.error(error)
       
       return NextResponse.json({
        error : "failed to fetch profile"
       },{
        status :500
       })
    }
}