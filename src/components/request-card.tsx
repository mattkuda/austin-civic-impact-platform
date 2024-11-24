import { Request } from "@/types";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RequestCardProps {
  request: Request;
  showUpvoteButton?: boolean;
}

export function RequestCard({ request, showUpvoteButton = true }: RequestCardProps) {
  const queryClient = useQueryClient();

  const upvoteMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/requests/upvote/${requestId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to upvote");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch requests
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  return (
    <Card className="border mesh-gradient">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">{request.description}</CardTitle>
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <p>Location: {request.locationName}</p>
          <p>
            Coordinates: {request.location.lat}, {request.location.long}
          </p>
          {request.category && <p>Category: {request.category}</p>}
          {request.cluster !== undefined && <p>Cluster: {request.cluster}</p>}
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <span className="text-gray-600">Votes: {request.upvoteCount}</span>
        {showUpvoteButton && (
          <Button
            variant="outline"
            className="hover:bg-[var(--primary)] hover:text-white transition-colors"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            onClick={() => upvoteMutation.mutate(request._id)}
            disabled={upvoteMutation.isPending}
          >
            {upvoteMutation.isPending ? "Upvoting..." : "Upvote"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
