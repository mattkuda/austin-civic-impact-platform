export interface User {
    id: number
    name: string
    // Add more user fields as needed
}

export type LeaderboardEntry = {
    rank: number;
    name: string;
    points: number;
    eventsParticipated: number;
};
