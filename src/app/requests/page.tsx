"use client";

import { Request } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { RequestCard } from "@/components/request-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lightbulb, Plus } from "lucide-react";

const fetchRequests = async (): Promise<Request[]> => {
  const res = await fetch("/api/requests");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function RequestsPage() {
  const {
    data: requests,
    isLoading,
    error,
  } = useQuery<Request[]>({
    queryKey: ["requests"],
    queryFn: fetchRequests,
  });

  console.log(JSON.stringify(requests, null, 2));

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-96">Error loading requests</div>;
  }

  return (
    <main className="flex-1">
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
            <Lightbulb size={32} />
            Community Requests
          </h1>
          <Button asChild size="sm" className="bg-gradient-to-r from-primary to-secondary text-white">
            <Link href="/submit" className="flex items-center gap-2">
              Submit Request
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          {!isLoading && requests?.map((request) => <RequestCard key={request.id} request={request} />)}
        </div>
      </div>
    </main>
  );
}
