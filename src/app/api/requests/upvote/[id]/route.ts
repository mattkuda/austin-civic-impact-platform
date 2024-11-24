/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(
    request: NextRequest
) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        await client.connect()
        const db = client.db("acip")

        const result = await db.collection("requests").updateOne(
            { _id: new ObjectId(id) },
            { $inc: { upvoteCount: 1 } }
        )

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { error: "Request not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error("Failed to upvote request:", e)
        return NextResponse.json(
            { error: "Failed to upvote request" },
            { status: 500 }
        )
    } finally {
        await client.close()
    }
} 