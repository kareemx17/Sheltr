import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { shelters } from "@/components/shelterData";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("sheltersdb");
    const collection = db.collection("shelterscollection");

    // Upload all shelters
    const result = await collection.insertMany(shelters);

    return NextResponse.json({ insertedCount: result.insertedCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
