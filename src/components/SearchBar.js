import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form className={`search-bar ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
      <i className="fas fa-search search-icon"></i>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder={placeholder || 'ابحث عن منتج، جهاز، أو أي شيء...'} />
      {query && <i className="fas fa-times clear-icon" onClick={() => setQuery('')}></i>}
      <button type="submit"><i className="fas fa-arrow-left"></i></button>
    </form>
  );
}

export default SearchBar;
