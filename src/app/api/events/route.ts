import { NextResponse } from 'next/server'
import { Event } from '@/types'

const mockEvents: Event[] = [
    {
        id: "1",
        title: "Community Clean-up Day",
        description: "Join us for a day of community service and beautification. We'll be cleaning up local parks and streets to make our city look its best.",
        date: "2024-03-15",
        attendees: 25,
        category: "volunteer"
    },
    {
        id: "2",
        title: "Town Hall Meeting",
        description: "Have your voice heard at our town hall meeting. This is your chance to discuss local issues and share your ideas with elected officials.",
        date: "2024-03-20",
        attendees: 10,
        category: "community"
    },
    {
        id: "3",
        title: "Local Art Festival",
        description: "Experience the creativity of our community at our annual art festival. Enjoy live music, art demonstrations, and a chance to purchase local artwork.",
        date: "2024-04-01",
        attendees: 15,
        category: "community"
    },
    {
        id: "4",
        title: "Tech Startup Showcase",
        description: "Learn about the latest innovations in technology from our local startups. This event is a great opportunity to network with industry leaders and potential investors.",
        date: "2024-04-15",
        attendees: 10,
        category: "community"
    },
    {
        id: "5",
        title: "Green Energy Workshop",
        description: "Discover how you can reduce your carbon footprint and save money by switching to green energy. This workshop will cover the latest technologies and incentives available.",
        date: "2024-04-22",
        attendees: 5,
        category: "community"
    }
]

export async function GET() {
    return NextResponse.json(mockEvents)
} 