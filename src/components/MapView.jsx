import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
});

const shopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

export default function MapView({ shops }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error(err);
        setPosition([16.7741, 96.1588]); // Default Yangon
      }
    );
  }, []);

  if (!position) return <p>Loading location...</p>;

  return (
    <MapContainer center={position} zoom={14} style={{ height: "85vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Location */}
      <Marker position={position} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Filtered Shops */}
      {shops.map((shop) => (
        <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={shopIcon}>
          <Popup>
            <b>{shop.name}</b>
            <br />
            {shop.address}
            <br />
             {shop.phone}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}