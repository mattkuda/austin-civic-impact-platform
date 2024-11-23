import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const requests = [
    { id: 1, title: "Add more bike lanes", votes: 15 },
    { id: 2, title: "Expand community gardens", votes: 10 },
    { id: 3, title: "Improve public transportation", votes: 20 },
]

export default function RequestsPage() {
    return (
        <main className="flex-1">
            <div className="container max-w-7xl mx-auto py-8">
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">Requests</h2>
                        <Button asChild size="sm" className="bg-gradient-to-r from-primary to-secondary text-white">
                            <Link href="/submit" className="flex items-center gap-2">
                                Create Request
                                <Plus className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <Card key={request.id} className="border mesh-gradient">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-900">{request.title}</CardTitle>
                                </CardHeader>
                                <CardFooter className="flex justify-between items-center">
                                    <span className="text-gray-600">Votes: {request.votes}</span>
                                    <Button
                                        variant="outline"
                                        className="hover:bg-[var(--primary)] hover:text-white transition-colors"
                                        style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                                    >
                                        Upvote
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

