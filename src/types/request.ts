import { User } from './user'

export interface Request {
    id: string
    user: User
    description: string
    locationName: string
    location: {
        lat: number
        long: number
    }
    category?: string
    createdAt: string
    upvoteCount: number
}

export interface RequestForm {
    description: string
    location: string
    latitude: string
    longitude: string
    category: string
} 