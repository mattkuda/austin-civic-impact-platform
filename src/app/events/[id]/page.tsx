'use client'

import { useQuery } from "@tanstack/react-query"
import { Event } from '@/types'
import { Calendar, Users, MapPin } from "lucide-react"
import { format, parseISO } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

const fetchEvent = async (id: string): Promise<Event> => {
    console.log("Fetching event", id)
    const res = await fetch(`/api/events/${id}`)
    if (!res.ok) {
        throw new Error('Network response was not ok')
    }
    return res.json()
}

export default function EventPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { toast } = useToast()

    const [attendees, setAttendees] = useState(0)

    const { data: event, isLoading, error } = useQuery<Event>({
        queryKey: ['event', params.id],
        queryFn: () => fetchEvent(params.id),
    })

    const handleAttend = async (eventClick: React.MouseEvent<HTMLButtonElement>) => {
        // Stop the click event from bubbling up to the card
        eventClick.stopPropagation()

        try {
            const res = await fetch(`/api/events/attend/${event.id}`, {
                method: 'POST',
            })

            if (!res.ok) throw new Error('Failed to attend event')

            toast({
                title: "Success!",
                description: "You're now registered for this event.",
                variant: "success",
            })
            setAttendees(attendees + 1)
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to register for event. ${error.message}`,
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-96">Error loading event</div>
    }

    if (!event) {
        return <div className="flex justify-center items-center h-96">Event not found</div>
    }

    return (
        <main className="flex-1">
            <div className="container max-w-4xl mx-auto py-8">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    ← Back to Events
                </Button>
                <Card className="border mesh-gradient">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            {event.title}
                        </CardTitle>
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-5 w-5" />
                                <span>{format(parseISO(event.date), 'EEEE, MMMM do, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users className="h-5 w-5" />
                                <span>{attendees} attendees</span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-5 w-5" />
                                    <span>{event.location}</span>
                                </div>
                            )}
                            {event.toolsRequired && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    {/* <Tool className="h-5 w-5" /> */}
                                    <span>Tools needed: {event.toolsRequired}</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none">
                            <p className="text-gray-600 whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            onClick={handleAttend}
                            className="bg-gradient-to-r from-primary to-secondary text-white"
                        >
                            Attend Event
                        </Button>
                    </CardFooter>
                </Card>
                <h2 className="text-2xl font-bold mb-4">Completed Requests</h2>
                {event.completedRequests && event.completedRequests.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Completed Requests</h3>
                        <div className="space-y-4">
                            {event.completedRequests.map((request) => (
                                <div
                                    key={request._id}
                                    className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                                >
                                    <p className="font-medium">{request.description}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Requested by: {request.user.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}