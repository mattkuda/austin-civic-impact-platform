'use client'

import { Trophy } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

interface LeaderboardEntry {
    rank: number
    name: string
    points: number
    eventsParticipated: number
}

export function Leaderboard() {
    const leaderboardQuery = useQuery<LeaderboardEntry[]>({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const res = await fetch('/api/leaderboard')
            if (!res.ok) throw new Error('Failed to fetch leaderboard')
            return res.json()
        }
    })

    if (leaderboardQuery.isLoading) {
        return <div>Loading leaderboard...</div>
    }

    if (leaderboardQuery.error) {
        return <div>Error loading leaderboard</div>
    }

    return (
        <section className="mb-12">
            <div className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <Trophy size={32} />
                <h2>Community Leaders</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
                {leaderboardQuery.data?.slice(0, 3).map((entry) => (
                    <div
                        key={entry.name}
                        className={`p-6 rounded-lg border ${entry.rank === 1
                                ? "bg-yellow-50 border-yellow-200"
                                : entry.rank === 2
                                    ? "bg-gray-50 border-gray-200"
                                    : "bg-orange-50 border-orange-200"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-4xl">
                                {entry.rank === 1 ? "🏆" : entry.rank === 2 ? "🥈" : "🥉"}
                            </span>
                            <span className="text-2xl font-bold">#{entry.rank}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{entry.name}</h3>
                        <div className="space-y-1 text-gray-600">
                            <p>{entry.points} points</p>
                            <p>{entry.eventsParticipated} events participated</p>
                        </div>
                    </div>
                ))}
            </div>

            {leaderboardQuery.data && leaderboardQuery.data.length > 3 && (
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Points
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Events
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {leaderboardQuery.data.slice(3).map((entry) => (
                                    <tr key={entry.name} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">#{entry.rank}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{entry.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{entry.points}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{entry.eventsParticipated}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    )
} 