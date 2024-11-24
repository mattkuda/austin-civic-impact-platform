// components/Map.js
import React from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { AUSTIN_CENTER } from "@/app/submit/page";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function Map({ markers }: { markers: { lat: number; lng: number; title: string }[] }) {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={AUSTIN_CENTER} zoom={12}>
        {markers.map((marker, idx) => (
          <Marker key={idx} position={{ lat: marker.lat, lng: marker.lng }} title={marker.title} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
