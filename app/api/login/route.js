import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setTokenCookie, signToken } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db("sheltersdb");

  const user = await db.collection("users").findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ email, id: user._id });
  setTokenCookie(token);

  return NextResponse.json({ name: user.name, email: user.email });
}
