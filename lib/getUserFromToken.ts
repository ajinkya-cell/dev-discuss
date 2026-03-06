import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromToken() {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  console.log("TOKEN FROM COOKIE:", token);

  if (!token) return null;

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    console.log("DECODED USER:", decoded);

    return decoded.id;

  } catch (error) {

    console.log("JWT ERROR:", error);

    return null;
  }
}