import { NextResponse } from 'next/server'

const mockRequests = {
    "1": {
        id: 1,
        user: { id: 1, name: "John Doe" },
        description: "Add more bike lanes",
        location: "South Congress Avenue",
        latitude: 30.2672,
        longitude: -97.7431,
        category: "infrastructure",
        createdAt: "2024-03-10T10:00:00Z",
        upvoteCount: 15
    },
    // ... more requests
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const request = mockRequests[params.id as keyof typeof mockRequests]

    if (!request) {
        return NextResponse.json(
            { error: "Request not found" },
            { status: 404 }
        )
    }

    return NextResponse.json(request)
} 