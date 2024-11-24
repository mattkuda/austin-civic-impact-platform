"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "../../components/ui/card";
import { Send } from "lucide-react";
import { RequestForm } from "@/types";

export default function SubmitSuggestionPage() {
  const [formData, setFormData] = useState<RequestForm>({
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rquests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description,
          location: formData.location,
          lat: parseFloat(formData.latitude),
          long: parseFloat(formData.longitude),
          category: formData.category,
          userId: "1", // Hardcoded for now
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit suggestion");
      }

      const result = await response.json();
      console.log("Submission successful:", result);

      // Reset form
      setFormData({
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        category: "",
      });
    } catch (error) {
      console.error("Error submitting suggestion:", error);
    }
    console.log(formData);
  };

  return (
    <main className="flex-1">
      <div className="container max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Submit a Suggestion</h1>
        <Card className="border">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your suggestion in detail"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter the address or location description"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-end">
                  <Label htmlFor="latitude">Latitude</Label>
                </div>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="30.2672"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="text-right"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-end">
                  <Label htmlFor="longitude">Longitude</Label>
                </div>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="-97.7431"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="text-right"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="volunteer">Volunteer Need</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure Fix</SelectItem>
                  <SelectItem value="community">Community Event</SelectItem>
                  <SelectItem value="safety">Safety Concern</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white">
              <span className="flex items-center gap-2">
                Submit Suggestion
                <Send className="h-4 w-4" />
              </span>
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
