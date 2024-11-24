import { NextResponse } from 'next/server'

// Mock data for now
const mockLeaderboard = [
  { rank: 1, name: "John Doe", points: 1200, eventsParticipated: 15 },
  { rank: 2, name: "Jane Smith", points: 1100, eventsParticipated: 12 },
  { rank: 3, name: "Bob Johnson", points: 900, eventsParticipated: 10 },
  { rank: 4, name: "Alice Brown", points: 800, eventsParticipated: 8 },
  { rank: 5, name: "Charlie Wilson", points: 700, eventsParticipated: 7 },
]

export async function GET() {
  return NextResponse.json(mockLeaderboard)
}
