import { NextResponse } from 'next/server'

const mockRequests = [
    {
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
    // ... more mock requests
]

export async function GET() {
    return NextResponse.json(mockRequests)
}

export async function POST(req: Request) {
    const body = await req.json()

    // Normally would validate and save to DB
    const newRequest = {
        id: mockRequests.length + 1,
        user: { id: 1, name: "John Doe" }, // Would come from auth
        ...body,
        createdAt: new Date().toISOString(),
        upvoteCount: 0
    }

    return NextResponse.json({ requestId: newRequest.id })
} 