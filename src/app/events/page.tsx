'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useQuery } from "@tanstack/react-query"
import { Event } from '@/types'
import { Calendar } from "lucide-react"
import { EventCard } from "@/components/event-card"

const fetchEvents = async (): Promise<Event[]> => {
    const res = await fetch('/api/events')
    if (!res.ok) {
        throw new Error('Network response was not ok')
    }
    return res.json()
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
                    <div className="flex justify-center items-center mb-4">
                        <h1 className="text-4xl font-bold mb-4 text-gray-700 flex items-center gap-2">
                            <Calendar size={32} />
                            Events
                        </h1>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Featured</h2>
                    <Carousel className="w-full max-w-5xl mx-auto">
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {events?.map((event) => (
                                <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                    <EventCard event={event} variant="compact" showAttendButton={false} />
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
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}

