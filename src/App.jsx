import React, { useState } from "react";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import shops from "./shops.json";

export default function App() {
  const [filteredShops, setFilteredShops] = useState(shops);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredShops(shops);
    } else {
      const lower = query.toLowerCase();
      setFilteredShops(
        shops.filter((s) => s.name.toLowerCase().includes(lower))
      );
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Nearby Phone Shops</h1>
      <SearchBar onSearch={handleSearch} />
      <MapView shops={filteredShops} />
    </div>
  );
}