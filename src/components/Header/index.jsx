import React from 'react';
import './Header-styles.css';

const Header = (props) => {
  if (window.location.pathname === '/') {
    let className;
    props.loaded ? className="landing-header" : className="landing-header unloaded"
    return (
      <header className={className}>
        <div className="header-text landing-page">
          <h1 className="landing-header-h1">Carbon</h1>
          <h2 className="landing-subheader-h2">COLLECTIVE</h2>
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
