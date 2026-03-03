import z from "zod";
import bcrypt from "bcrypt"
import { users } from "@/db/schema/users";
import { db } from "@/db";
import { NextResponse } from "next/server";

const schema = z.object({
    name : z.string().min(3),
    email:z.string().email(),
    password : z.string().min(6),
})

export async function POST(req : Request){
    try {
        const body = await req.json();
        const data = schema.parse(body)

        const hashed = await bcrypt.hash(data.password , 10);
        const [user] = await db.insert(users).values({
            name : data.name,
            email : data.email,
            password :hashed
        }).returning();

        return NextResponse.json({
            id : user.id,
            name : user.name,
            email:user.email,
        })
    } catch (error : any ) {
    if (error?.cause?.code === "23505") {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }
    return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
        
    }
}