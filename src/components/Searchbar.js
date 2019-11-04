import React from 'react';

function Searchbar(props) {
  return (
    <div className="search-container">
      <span>Search through</span>
      <select
        onChange={(e) => {
          props.onSelect(e.target.value)
        }}
        id="select-btn"
      >
        <option value='top-headlines'>top headlines</option>
        <option value='everything'>all news</option>
      </select>
      <div className="searchbar-container">
        <input id="searchbar" type="text" placeholder="Search headlines"/>
        <button id="search-button" onClick={ () => { props.onSearch(document.getElementById('searchbar').value)} }>Search</button>
      </div>
      <button id='clear-search-btn' onClick={ () => { props.onClear() } }>Clear Search</button>
    </div>
  );
}

export default Searchbar;
