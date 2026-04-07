import { useState } from "react";

function SearchBar({ onSearch, isLoading }) {
  const [city, setCity] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = city.trim();

    if (!trimmed) {
      onSearch("");
      return;
    }

    onSearch(trimmed);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="city-input">
        City name
      </label>
      <div className="search-shell">
        <input
          id="city-input"
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Search for a city..."
          autoComplete="off"
          className="search-input"
        />
        <button type="submit" disabled={isLoading} className="search-button">
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
