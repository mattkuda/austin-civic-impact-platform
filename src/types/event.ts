export interface Event {
    id: string
    title: string
    description: string
    date: string
    attendees: number
    // tools: string[]
    category: string
}

export interface EventResponse {
    id: string
    approved: boolean
} 