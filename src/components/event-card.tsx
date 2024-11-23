import { Event } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EventCardProps {
    event: Event
    variant?: 'compact' | 'full'
    showAttendButton?: boolean
}

export function EventCard({ event, variant = 'full', showAttendButton = true }: EventCardProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString()
    }

    return (
        <Card className="border mesh-gradient">
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
                        {event.attendees} {event.attendees === 1 ? 'attendee' : 'attendees'}
                    </p>
                </div>
            </CardContent>
            {showAttendButton && (
                <CardFooter className="flex justify-end items-center">
                    <Button
                        variant="outline"
                        className="hover:bg-[var(--primary)] hover:text-white transition-colors"
                        style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                    >
                        Attend Event
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
} 