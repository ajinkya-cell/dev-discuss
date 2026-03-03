import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/problems")) {
    const token = req.cookies.get("token")?.value;

    if (!token)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}