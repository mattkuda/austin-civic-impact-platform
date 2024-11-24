// components/Map.js
import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function Map({ markers }: { markers: { lat: number; lng: number; title: string }[] }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Store your API key in .env
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={markers[0]} zoom={10}>
      {markers.map((marker, idx) => (
        <Marker key={idx} position={{ lat: marker.lat, lng: marker.lng }} title={marker.title} />
      ))}
    </GoogleMap>
  );
}
