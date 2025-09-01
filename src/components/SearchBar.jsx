import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "10px",
        background: "#f0f0f0",
      }}
    >
      <input
        type="text"
        placeholder="🔍 Search shop name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "8px",
          fontSize: "16px",
          width: "60%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        type="submit"
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          background: "#333",
          color: "white",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </form>
  );
}