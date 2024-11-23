'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useQuery } from "@tanstack/react-query"
import { Event } from '@/types'
import { format, parseISO } from 'date-fns'

const fetchEvents = async (): Promise<Event[]> => {
    const res = await fetch('/api/events')
    if (!res.ok) {
        throw new Error('Network response was not ok')
    }
    return res.json()
}

const formatDate = (date: string) => {
    return format(parseISO(date), 'EEEE, MMMM do, yyyy')
}

export default function EventsPage() {
    const { data: events, isLoading, error } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    })

    if (isLoading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-96">Error loading events</div>
    }

    return (
        <main className="flex-1">
            <div className="container max-w-7xl mx-auto py-8">
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Featured Events</h2>
                    <Carousel className="w-full max-w-5xl mx-auto">
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {events?.map((event) => (
                                <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                    <Card className="border mesh-gradient">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 font-medium">
                                                {formatDate(event.date)}
                                            </p>
                                            <p className="text-gray-600 line-clamp-3 mt-2">
                                                {event.description}
                                            </p>
                                            <p className="text-gray-600 mt-2">
                                                {event.attendees} {event.attendees === 1 ? 'attendee' : 'attendees'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </section>

                <section className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">All Events</h2>
                    </div>
                    <div className="space-y-4">
                        {events?.map((event) => (
                            <Card key={event.id} className="border mesh-gradient">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 font-medium">{formatDate(event.date)}</p>
                                    <p className="text-gray-600 mt-2">{event.description}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-gray-600">Category: {event.category}</p>
                                        <p className="text-gray-600">
                                            {event.attendees} {event.attendees === 1 ? 'attendee' : 'attendees'}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end items-center">
                                    <Button
                                        variant="outline"
                                        className="hover:bg-[var(--primary)] hover:text-white transition-colors"
                                        style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                                    >
                                        Attend Event
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}

