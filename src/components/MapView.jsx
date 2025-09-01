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

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapView({ shops, targetShop }) {
  const [position, setPosition] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const userPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(userPos);

        if (targetShop) {
          const dist = getDistance(
            userPos[0],
            userPos[1],
            targetShop.lat,
            targetShop.lng
          );
          if (dist < 0.05) {
            setMessage("ရောက်ပါပီဗျာ...😚");
          } else {
            setMessage(`📍 ${dist.toFixed(2)} km လိုသေးတယ်`);
          }
        } else {
          setMessage("");
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, [targetShop]);

  if (!position) return <p>Loading location...</p>;

  return (
    <div>
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User marker */}
        <Marker position={position} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Shops */}
        {shops.map((shop) => (
          <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={shopIcon}>
            <Popup>
              <b>{shop.name}</b>
              <br />
              {shop.address}
              <br />
              📞 {shop.phone}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {message && (
        <div
          style={{
            background: "#fffae6",
            padding: "10px",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
