import { db } from "@/db";
import { users } from "@/db/schema/users";
import z from "zod";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const schema = z.object({
    email:z.string().email(),
    password : z.string()
})

export async function POST(req : Request){
    try {
        const body =await req.json()
        const data = schema.parse(body)

        const result = await db
        .select()
        .from(users)
        .where(eq(users.email , data.email))

        if (!result.length)
            return NextResponse.json(
        {error : " Incorrect credentials "} ,
    {
        status: 402
    })

    const user = result[0];

    const valid = await bcrypt.compare(
        data.password,
        user.password
    )
     if (!valid)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 403 }
      );

      const token = jwt.sign(
        {id : user.id},
        process.env.JWT_SECRET!,
        {expiresIn : "7d"}
      )
      
      console.log("JWT TOKEN:", token);
      const response = NextResponse.json({
        message : "Login succressfull "
      },{
        status:201
      })

      response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
    } catch (error:any) {
        console.log(error.code)
        console.log(error.cause)
    }
}