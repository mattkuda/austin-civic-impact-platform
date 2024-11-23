import { NextResponse } from 'next/server';
import client from '@/lib/mongodb';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const { userId, description, location, lat, long, category } = await request.json();
  try {

    await client.connect();
    const db = client.db("acip");
    const newSubmission = await db.collection("requests").insertOne({
      userId,
      description,
      location: { lat, long },
      locationName: location,
      category: category || null,
      createdAt: new Date().toISOString(),
      upvoteCount: 0,
    });
    console.log("Submission successful", newSubmission.insertedId);
    return NextResponse.json({ submissionId: newSubmission.insertedId }, { status: 201 });
  } catch (e) {
    console.error("Failed to insert submission:", e);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    await client.connect();
    const db = client.db("acip");
    const requests = await db
      .collection("requests")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(requests, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  } finally {
    await client.close();
  }
} 