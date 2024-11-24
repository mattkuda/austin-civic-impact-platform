/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
    request: NextRequest
) {

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    // TODO: Validate event with ID: params.id exists
    // TODO: Process attendance request from request body
    return NextResponse.json({ approved: true })
} 