/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log("attend event request", id)

    try {
        await client.connect()
        const db = client.db("acip")

        const result = await db.collection("events").updateOne(
            { _id: new ObjectId(id) },
            { $inc: { attendees: 1 } }
        )

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error("Failed to attend event:", e)
        return NextResponse.json(
            { error: "Failed to attend event" },
            { status: 500 }
        )
    } finally {
        await client.close()
    }
} 