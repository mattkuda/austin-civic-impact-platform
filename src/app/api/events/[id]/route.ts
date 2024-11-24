import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Event, Request } from '@/types'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise
        const db = client.db("acip")

        let query = {}

        // Try to use ObjectId if it's a valid MongoDB ID, otherwise use string id
        try {
            query = { _id: new ObjectId(params.id) }
        } catch {
            query = { id: params.id }
        }

        // Get the event
        const event = await db.collection<Event>("events").findOne(query)

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        // Ensure the event has an id field that matches _id
        const eventWithId = {
            ...event,
            id: event._id.toString(),
        }

        // Get completed requests if they exist
        if (eventWithId.completedRequestIds?.length) {
            const completedRequests = await db.collection<Request>("requests")
                .find({
                    _id: {
                        $in: eventWithId.completedRequestIds.map(id => {
                            try {
                                return new ObjectId(id.toString())
                            } catch {
                                return id // fallback to original id if not a valid ObjectId
                            }
                        })
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any // Type assertion to bypass strict typing
                })
                .toArray();

            eventWithId.completedRequests = completedRequests;
        }

        return NextResponse.json(eventWithId)
    } catch (e) {
        console.error("Failed to fetch event:", e)
        return NextResponse.json(
            { error: "Failed to fetch event" },
            { status: 500 }
        )
    }
}