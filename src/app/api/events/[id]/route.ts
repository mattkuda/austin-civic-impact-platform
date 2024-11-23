import { NextResponse } from 'next/server'
import client from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await client.connect();
        const db = client.db("acip");
        const event = await db.collection("events").findOne({ id: params.id });
        console.log("Event found", event);
        return NextResponse.json(event, { status: 200 });
    } catch (e) {
        console.error("Failed to find event:", e);
        return NextResponse.json({ error: "Failed to find event" }, { status: 500 });
    } finally {
        await client.close();
    }
} 