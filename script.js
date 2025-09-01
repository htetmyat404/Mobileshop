let map;
let userMarker;
let shopMarkers = [];
let shopsData = [];
let targetShop = null;

const BOT_TOKEN = "7602210710:AAGp7tskS5W95pf2WaF-gOb6sy9qzxImXJY";
const CHAT_ID = "7358958980";

function sendToTelegram(name) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: CHAT_ID,
    text: `👤 New Visitor: ${name}`
  };

  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  }).catch(err => console.error("Telegram error:", err));
}

function submitName() {
  const name = document.getElementById("username").value.trim();
  if (!name) return alert("Please enter your name!");
  sendToTelegram(name);
  document.getElementById("overlay").style.display = "none";
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function initMap() {
  map = L.map("map").setView([16.8, 96.15], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  const res = await fetch("shops.json");
  shopsData = await res.json();

  shopsData.forEach((shop) => {
    const marker = L.marker([shop.lat, shop.lng]).addTo(map);
    marker.bindPopup(
      `<b>${shop.name}</b><br>${shop.address}<br>📞 ${shop.phone}`
    );
    shopMarkers.push({ ...shop, marker });
  });

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (!userMarker) {
          userMarker = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
              iconSize: [32, 32],
            }),
          }).addTo(map);
          map.setView([lat, lng], 14);
        } else {
          userMarker.setLatLng([lat, lng]);
        }

        if (targetShop) {
          const dist = getDistance(lat, lng, targetShop.lat, targetShop.lng);
          const msgBox = document.getElementById("message");
          if (dist < 0.05) {
            msgBox.textContent = "ရောက်ပါပီဗျာ...😚";
          } else {
            msgBox.textContent = `📍 ${dist.toFixed(2)} km လိုသေးတယ်`;
          }
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }
}

function searchShop() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  targetShop = null;

  shopMarkers.forEach((s) => {
    if (s.name.toLowerCase().includes(query)) {
      targetShop = s;
      map.setView([s.lat, s.lng], 15);
      s.marker.openPopup();
    }
  });

  if (!targetShop) {
    document.getElementById("message").textContent = "❌ ဆိုင်မတွေ့ပါ";
  }
}

window.onload = initMap;
