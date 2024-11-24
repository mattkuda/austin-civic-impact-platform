"use client";

import { useState, useCallback } from "react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import type { GoogleMap as GoogleMapType } from '@react-google-maps/api';
import { Lightbulb, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AUSTIN_CENTER = {
  lat: 30.2672,
  lng: -97.7431
};

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

export default function SubmitSuggestionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    description: "",
    locationName: "",
    lat: AUSTIN_CENTER.lat.toString(),
    long: AUSTIN_CENTER.lng.toString(),
    category: ""
  });
  const [markerPosition, setMarkerPosition] = useState(AUSTIN_CENTER);
  const [searchAddress, setSearchAddress] = useState("");
  const [mapRef, setMapRef] = useState<GoogleMapType | null>(null);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      setMarkerPosition({ lat, lng });
      setFormData(prev => ({
        ...prev,
        lat: lat.toString(),
        long: lng.toString()
      }));

      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          setFormData(prev => ({
            ...prev,
            locationName: results[0].formatted_address
          }));
        }
      });
    }
  }, []);

  const onMapLoad = useCallback((map: GoogleMapType) => {
    setMapRef(map);
  }, []);

  const handleSearch = () => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchAddress + " Austin, TX" }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        const newPosition = { lat, lng };

        setMarkerPosition(newPosition);
        setFormData(prev => ({
          ...prev,
          lat: lat.toString(),
          long: lng.toString(),
          locationName: results[0].formatted_address
        }));

        // Pan map to new location
        mapRef?.panTo(newPosition);
        // @ts-expect-error: works
        mapRef?.setZoom(15); // Zoom in closer to the selected location
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      toast({
        title: "Success!",
        description: "Your request has been submitted successfully.",
        variant: "success",
      });

      // Navigate to requests page after successful submission
      router.push('/requests');
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex-1">
      <div className="container max-w-2xl mx-auto py-8">
        <h1 className="mb-6 text-4xl font-bold text-gray-800 flex items-center gap-2">
          <Lightbulb size={32} />
          Submit Request
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your request"
              value={formData.description}
              rows={5}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Search address in Austin"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              />
              <Button
                variant="outline"
                type="button"
                onClick={handleSearch}
                style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                Search
              </Button>
            </div>

            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={AUSTIN_CENTER}
                zoom={12}
                onClick={onMapClick}
                // @ts-expect-error: works
                onLoad={onMapLoad}
              >
                <Marker position={markerPosition} />
              </GoogleMap>
            </LoadScript>

            <Input
              id="locationName"
              placeholder="Location name/address"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              className="mt-2"
            />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="lat">lat</Label>
                <Input
                  id="lat"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="long">long</Label>
                <Input
                  id="long"
                  value={formData.long}
                  onChange={(e) => setFormData({ ...formData, long: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white">
            <span className="flex items-center gap-2">
              Submit Request
              <Send className="h-4 w-4" />
            </span>
          </Button>
          {JSON.stringify(formData)}
        </form>
      </div>
    </main>
  );
}
