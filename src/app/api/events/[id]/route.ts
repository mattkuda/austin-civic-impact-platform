import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Mock event data
    const mockEvent = {
        id: params.id,
        title: "Community Clean-up Day",
        description: "Join us for a day of community service and beautification.",
        date: "2024-03-15",
        attendees: 25,
        category: "volunteer"
    }

    return NextResponse.json(mockEvent)
} 