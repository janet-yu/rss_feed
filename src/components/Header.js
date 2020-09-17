import React from "react";
import Searchbar from "./Searchbar";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header>
      <div className="container">
        <a
          href=""
          onClick={(e) => {
            document.location.reload(true);
          }}
        >
          <h1 id="site-heading">RSS FEED</h1>
        </a>
        <span id="header-subtitle">Get your daily news all in one place.</span>
        <Searchbar
          onSearch={props.onSearch}
          onSelect={props.onSelect}
          onClear={props.onClear}
        />
      </div>
    </header>
  );
}

export default Header;
