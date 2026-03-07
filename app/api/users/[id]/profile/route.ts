import { db } from "@/db"
import { follows } from "@/db/schema/follows"
import { problems } from "@/db/schema/problems"
import { solutions } from "@/db/schema/solutions"
import { users } from "@/db/schema/users"
import { count, eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET(
    req : Request,
    context : {params : Promise<{id :string}>}
){
    try {
        let {id} = await context.params

        if (id === "me") {
            const cookieStore = await cookies()
            const token = cookieStore.get("token")?.value
            if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
            id = decoded.id
        }


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

     let isFollowing = false;
     let isOwnProfile = false;
     try {
       const cookieStore = await cookies();
       const token = cookieStore.get("token")?.value;
       if (token) {
         const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
         const currentUserId = decoded.id;
         isOwnProfile = currentUserId === id;
         
         if (!isOwnProfile) {
           const existingFollow = await db
             .select()
             .from(follows)
             .where(
               and(eq(follows.followerId, currentUserId), eq(follows.followingId, id))
             );
           if (existingFollow.length > 0) isFollowing = true;
         }
       }
     } catch (e) {}

    return NextResponse.json({
        user : user[0],
        stats : {
            problems : problemCount[0].value,
            solutions : solutionCount[0].value,
            followers : followerCount[0].value,
            following : followingCount[0].value
        },
        isFollowing,
        isOwnProfile
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