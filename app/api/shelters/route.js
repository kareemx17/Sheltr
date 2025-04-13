// app/api/shelters/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("sheltersdb");
  const shelters = await db.collection("shelterscollection").find({}).toArray();
  const cleaned = shelters.map(({ _id, ...rest }) => rest);
  return NextResponse.json(cleaned);
}
