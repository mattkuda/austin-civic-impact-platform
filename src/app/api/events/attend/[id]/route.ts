import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Would normally validate event exists and handle attendance logic
    return NextResponse.json({ approved: true })
} 