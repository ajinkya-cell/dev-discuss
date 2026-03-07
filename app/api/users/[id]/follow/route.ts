import { db } from "@/db";
import { follows } from "@/db/schema/follows";
import { users } from "@/db/schema/users";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req:Request ,
    context : {params : Promise <{id : string}>}
){
    try {
        const followerId = await getUserFromToken()

        if (!followerId)
            return NextResponse.json(
        {error : "Unauthorized"},
    {
        status : 401
    })

    const { id } = await context.params

    const targetUser = await db
     .select()
     .from(users)
     .where(eq(users.id , id))

    if (!targetUser.length)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
      
    if(followerId === id)
        return NextResponse.json(
           {error : " Your cannnot follow yourself"},
           {status : 400}
        )  
    const existingFollow = await db
     .select()
     .from(follows)
     .where(
        and(
            eq(follows.followerId , followerId),
            eq(follows.followingId , id)
        )
     )   
     
     if(existingFollow.length){
        await db
         .delete(follows)
         .where(
            and(
                eq(follows.followerId, followerId),
                eq(follows.followingId , id)
            )
         )

         return NextResponse.json({
            message : "Unfollowed user"
         })
     }
    
    await db
    .insert(follows)
    .values({
        followerId,
        followingId:id
    }) 

    return NextResponse.json({
        messaged : "user  followed"
    })
    }catch(error){
       console.error("FOLLOW ERROR:", error);

  return NextResponse.json(
    {
      error: "Follow operation failed",
      detail: error || "Unknown error"
    },
    { status: 500 }
  );
    }
}