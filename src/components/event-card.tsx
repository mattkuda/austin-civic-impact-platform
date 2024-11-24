import { Event } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EventCardProps {
    event: Event
    variant?: 'compact' | 'full'
    showAttendButton?: boolean
}

export function EventCard({ event, variant = 'full', showAttendButton = true }: EventCardProps) {
    const router = useRouter();
    const [attendees, setAttendees] = useState(event.attendees)

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString()
    }

    const handleCardClick = () => {
        router.push(`/events/${event.id}`)
    }

    const handleAttend = (eventClick: React.MouseEvent<HTMLButtonElement>) => {
        // Stop the click event from bubbling up to the card
        eventClick.stopPropagation()

        fetch(`/api/events/attend/${event.id}`, {
            method: 'POST',
        })

        // Refresh the page to reflect the updated attendee count
        setAttendees(attendees + 1)
    }

    return (
        <Card
            className="border mesh-gradient cursor-pointer"
            onClick={handleCardClick}
        >
            <CardHeader>
                <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 font-medium">
                    {formatDate(event.date)}
                </p>
                <p className={`text-gray-600 mt-2 ${variant === 'compact' ? 'line-clamp-3' : ''}`}>
                    {event.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-600">Category: {event.category}</p>
                    <p className="text-gray-600">
                        {attendees} {attendees === 1 ? 'attendee' : 'attendees'}
                    </p>
                </div>
            </CardContent>
            {showAttendButton && (
                <CardFooter className="flex justify-end items-center">
                    <Button
                        variant="outline"
                        className="hover:bg-[var(--primary)] hover:text-white transition-colors"
                        style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                        onClick={handleAttend}
                    >
                        Attend Event
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
} 