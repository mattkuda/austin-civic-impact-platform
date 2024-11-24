import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import mongoClient from '@/lib/mongodb';
import { generateEvents } from '@/event-update';
import { Request } from '@/types/request';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Run Python clustering script
    const scriptPath = path.join(process.cwd(), 'src', 'lib', 'cluster_requests.py');
    await execAsync(`python ${scriptPath}`);

    return NextResponse.json({ message: "Clustering complete" });
  } catch (error) {
    console.error('Error running clustering script:', error);
    return NextResponse.json({ error: "Failed to cluster requests" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("acip");
    const collection = db.collection("requests");

    await collection.updateMany({ cluster: { $exists: true } }, { $unset: { cluster: 1 } });

    return NextResponse.json({ message: "Clustering reset" });
  } catch (error) {
    console.error('Error resetting clustering:', error);
    return NextResponse.json({ error: "Failed to reset clustering" }, { status: 500 });
  } finally {
    await mongoClient.close();
  }
}

export async function GET() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("acip");
    const collection = db.collection("requests");
    const unfilledRequests = await collection
      .aggregate([
        { $match: { status: "unfilled", cluster: { $exists: true } } },
        { $group: { _id: "$cluster", requests: { $push: "$$ROOT" } } },
      ])
      .toArray();

    const groupedRequests = unfilledRequests.map((rec) => [rec._id, rec.requests]) as unknown as Record<string, Request[]>; // Update type here    console.log(groupedRequests);
    const events = await generateEvents(groupedRequests);
    for (const e of events) {
      console.log(e.requests);
      //Update the requests to be with the parent event id
      // await collection.updateMany({ _id: { $in: e.requests } }, { $set: { eventId: e._id } });
    }
    await collection.updateMany({ _id: { $in: unfilledRequests.map(r => r._id) } }, { $set: { status: "filled" } });
    await db.collection("events").insertMany(events);

    return NextResponse.json({ message: "Events generated" });
  } catch (error) {
    console.error('Error generating events:', error);
    return NextResponse.json({ error: "Failed to generate events" }, { status: 500 });
  } finally {
    await mongoClient.close();
  }
}
