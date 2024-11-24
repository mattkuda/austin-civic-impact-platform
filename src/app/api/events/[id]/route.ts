import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Mock event data
    const mockEvent = {
        id,
        title: "Community Clean-up Day",
        description: "Join us for a day of community service and beautification.",
        date: "2024-03-15",
        attendees: 25,
        category: "volunteer",
    };

    return NextResponse.json(mockEvent);
}
