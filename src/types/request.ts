import { User } from './user'

export interface Request {
    id: number
    user: User
    description: string
    location: string
    latitude: number
    longitude: number
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