export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const token = searchParams.get("token");
  const isNew = searchParams.get("isNew") === "true";

  if (!token) {
    return NextResponse.redirect(
      new URL("/signup?error=no_token", request.url)
    );
  }

  // ✅ Set cookie on FRONTEND domain
  (
    await // ✅ Set cookie on FRONTEND domain
    cookies()
  ).set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  const redirectPath = isNew ? "/register" : "/leads";
  return NextResponse.redirect(new URL(redirectPath, request.url));
}
