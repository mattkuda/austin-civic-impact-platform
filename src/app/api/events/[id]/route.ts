import { NextResponse } from 'next/server'

const mockEvents = {
    "1": {
        id: 1,
        eventName: "Community Clean-up Day",
        eventDescription: "Join us for a day of community service and beautification.",
        targetDate: "2024-03-15",
        attendeeCount: 25,
        toolsRequired: "Gloves, trash bags, rakes",
        category: "volunteer"
    },
    // ... more events
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const event = mockEvents[params.id as keyof typeof mockEvents]

    if (!event) {
        return NextResponse.json(
            { error: "Event not found" },
            { status: 404 }
        )
    }

    return NextResponse.json(event)
} 