import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/", "/login", "/signup"];
const PUBLIC_PREFIXES = ["/api", "/_next", "/favicon.ico"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next(); // Authorized
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
