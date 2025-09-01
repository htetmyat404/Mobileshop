import React, { useState } from "react";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import shops from "./shops.json";

export default function App() {
  const [filteredShops, setFilteredShops] = useState(shops);
  const [targetShop, setTargetShop] = useState(null);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredShops(shops);
      setTargetShop(null);
    } else {
      const lower = query.toLowerCase();
      const results = shops.filter((s) => s.name.toLowerCase().includes(lower));
      setFilteredShops(results);
      setTargetShop(results.length ? results[0] : null);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>📱 Nearby Phone Shops</h1>
      <SearchBar onSearch={handleSearch} />
      <MapView shops={filteredShops} targetShop={targetShop} />
    </div>
  );
}
