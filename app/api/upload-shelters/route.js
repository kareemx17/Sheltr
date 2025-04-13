import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const shelter = await req.json();
  try {
    const client = await clientPromise;
    const db = client.db("sheltersdb");
    const collection = db.collection("shelterscollection");

    // Upload shelter
    const result = await collection.insertOne(shelter);

    return NextResponse.json({ insertedCount: result.insertedCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
