import { NextResponse } from 'next/server'
import { Event } from '@/types'

// Mock data
const mockEvents: Event[] = [
    {
        id: "1",
        title: "Community Clean-up Day",
        description: "Join us for a day of community service and beautification.",
        date: "2024-03-15",
        attendees: 25,
        category: "volunteer"
    },
    {
        id: "2",
        title: "Town Hall Meeting",
        description: "Have your voice heard at our town hall meeting.",
        date: "2024-03-20",
        attendees: 10,
        category: "community"
    },
]

export async function GET() {
    // Comment out MongoDB connection
    // try {
    //     await client.connect();
    //     const db = client.db("acip");
    //     const events = await db.collection("events").find({}).toArray();
    //     console.log("Events found", events);
    //     return NextResponse.json(events, { status: 200 });
    // } catch (e) {
    //     console.error("Failed to find events:", e);
    //     return NextResponse.json({ error: "Failed to find events" }, { status: 500 });
    // } finally {
    //     await client.close();
    // }

    return NextResponse.json(mockEvents)
} 