import { db } from "@/db";
import { users } from "@/db/schema/users";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const result = await db
         .select(({
            id : users.id,
            name:users.name,
            email:users.email,
            createdAt : users.createdAt
         }))
         .from(users)

         return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json(
            {error : "failed to fetch users"},
            {status : 500}
        )
    }
}