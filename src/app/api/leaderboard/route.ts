import { LeaderboardEntry } from "@/types";
import { NextResponse } from "next/server";


export async function GET() {
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "John Doe", points: 100, eventsParticipated: 5 },
    { rank: 2, name: "Jane Doe", points: 90, eventsParticipated: 4 },
    { rank: 3, name: "Jim Beam", points: 80, eventsParticipated: 3 },
    { rank: 4, name: "John Doe", points: 70, eventsParticipated: 2 },
    { rank: 5, name: "Jane Doe", points: 60, eventsParticipated: 1 },
    { rank: 6, name: "Jim Beam", points: 50, eventsParticipated: 1 },
    { rank: 7, name: "John Doe", points: 40, eventsParticipated: 1 },
    { rank: 8, name: "Jane Doe", points: 30, eventsParticipated: 1 },
    { rank: 9, name: "Jim Beam", points: 20, eventsParticipated: 1 },
    { rank: 10, name: "John Doe", points: 10, eventsParticipated: 1 },
  ];
  return NextResponse.json(leaderboard);
}
