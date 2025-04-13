import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/signup", "/api", "/_next", "/favicon.ico"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes without JWT
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next(); // token valid
  } catch (err) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}
