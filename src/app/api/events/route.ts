import { NextResponse } from 'next/server'
import mongoClient from '@/lib/mongodb';

export async function GET() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("acip");
        const events = await db.collection("events").find({}).toArray();
        console.log("Events found", events);
        return NextResponse.json(events, { status: 200 });
    } catch (e) {
        console.error("Failed to find events:", e);
        return NextResponse.json({ error: "Failed to find events" }, { status: 500 });
    } finally {
        await mongoClient.close();
    }
} 