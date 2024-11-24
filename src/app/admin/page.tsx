'use client'

import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useState } from "react"

export default function AdminPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isClustering, setIsClustering] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const runClustering = async () => {
    try {
      setIsClustering(true);
      const response = await fetch("/api/events/generate", { method: "POST" });
      if (!response.ok) throw new Error("Clustering failed");
      const data = await response.json();
      console.log("Clustering complete!", data);
    } catch (error) {
      console.error("Error:", error);
      console.log("Failed to run clustering");
    } finally {
      setIsClustering(false);
    }
  };

  const resetClusters = async () => {
    try {
      setIsResetting(true);
      const response = await fetch("/api/events/generate", { method: "DELETE" });
      if (!response.ok) throw new Error("Clustering failed");
      const data = await response.json();
      console.log("Clustering complete!", data);
    } catch (error) {
      console.error("Error:", error);
      console.log("Failed to reset clustering");
    } finally {
      setIsResetting(false);
    }
  };

  const generateEvents = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch("/api/events/generate");
      if (!response.ok) throw new Error("Event generation failed");
      const data = await response.json();
      console.log("Event generation complete!", data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate events");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex-1">
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="space-y-8">
          {/* Clustering Section */}
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-2">
              ⭐️ Run Clustering
            </h3>
            <p className="text-gray-600 mb-4">
              Groups similar requests together based on location and category.
              This helps organize requests that could be addressed in a single event.
            </p>
            <Button
              onClick={runClustering}
              disabled={isClustering}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white"
            >
              {isClustering ? "Processing..." : "Run Clustering"}
            </Button>
          </div>
          {/* Event Generation Section */}
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-2">Generate Events</h3>
            <p className="text-gray-600 mb-4">
              Creates events based on clustered requests using AI.
              The system will analyze request groups and suggest appropriate community events.
            </p>
            <Button
              onClick={generateEvents}
              disabled={isGenerating}
              className="w-full bg-green-500 hover:bg-green-700 text-white"
            >
              {isGenerating ? "Generating..." : "Generate Events"}
            </Button>
          </div>
          {/* Reset Section */}
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-2">Reset Clustering</h3>
            <p className="text-gray-600 mb-4">
              Clears all existing cluster assignments.
              Use this if you want to start fresh with request grouping.
            </p>
            <Button
              onClick={resetClusters}
              disabled={isResetting}
              variant="destructive"
              className="w-full"
            >
              {isResetting ? "Processing..." : "Reset Clustering"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}