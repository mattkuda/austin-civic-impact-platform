export interface Event {
    id: string
    title: string
    description: string
    date: string
    attendees: number
    location?: string
    toolsRequired?: string
    category: string
}

export interface EventResponse {
    id: string
    approved: boolean
}

export interface GeneratedEvent {
    _id: string;
    title: string;               // Title of the event
    description: string;         // Detailed description of the event
    location: {                  // Event location
        lat: number;             // Latitude of the event
        long: number;            // Longitude of the event
    };
    requests: string[];          // Array of IDs of requests this event addresses
    confidence: number;          // Confidence score (0.0 to 1.0) of how well this event addresses the requests
    geohash?: string;            // Optional geohash for grouped events (used for debugging or grouping)
}
