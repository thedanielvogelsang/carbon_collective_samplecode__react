import React from 'react';
import './Header-styles.css';

const Header = () => {
  if (window.location.pathname === '/') {
    return (
      <header className="landing-header">
        <div className="header-text landing-page">
          <h1>Carbon Collective</h1>
        </div>
      </header>
    )
  } else if (window.location.pathname === '/regionPage' || window.location.pathname=== '/login') {
    return (
      <header className='header'>
        <div className="header-img-container">
          <img
          className="cc-img"
          alt="app logo"
          src="./img/Leaf final_fill.png"
          />
        </div>
        <div className="header-text">
          <h1>Carbon Collective</h1>
        </div>
      </header>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
};

export default Header;
