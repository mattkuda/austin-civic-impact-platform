import { Request } from "@/types"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RequestCardProps {
    request: Request
    onUpvote?: (id: string) => void
    showUpvoteButton?: boolean
}

export function RequestCard({ request, onUpvote, showUpvoteButton = true }: RequestCardProps) {
    return (
        <Card className="border mesh-gradient">
            <CardHeader>
                <CardTitle className="text-lg text-gray-900">{request.description}</CardTitle>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <p>Location: {request.locationName}</p>
                    <p>Coordinates: {request.location.lat}, {request.location.long}</p>
                    {request.category && <p>Category: {request.category}</p>}
                </div>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
                <span className="text-gray-600">Votes: {request.upvoteCount}</span>
                {showUpvoteButton && (
                    <Button
                        variant="outline"
                        className="hover:bg-[var(--primary)] hover:text-white transition-colors"
                        style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                        onClick={() => onUpvote?.(request.id)}
                    >
                        Upvote
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
} 