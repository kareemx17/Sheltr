import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();
  console.log(name, email, password);
  
  const client = await clientPromise;
  const db = client.db("sheltersdb");

  const existing = await db.collection("users").findOne({ email });
  if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({ name, email, password: hashedPassword });

  return NextResponse.json({ success: true });
}
