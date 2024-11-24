import { User } from './user'

export interface Request {
    _id: string
    id?: string
    user: User
    description: string
    cluster?: number
    locationName: string
    location: {
        lat: number
        long: number
    }
    category?: string
    createdAt: string
    upvoteCount: number
    eventId?: string
    event?: Event
}

export interface RequestForm {
    description: string
    location: string
    latitude: string
    longitude: string
    category: string
} 