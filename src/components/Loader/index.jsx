import React, {Component} from 'react';
import "./Loader-styles.css";

class Loader extends Component{
  render() {
    return(
      <div className="app-container">
        <div className="loader"></div>
      </div>
    )
  }
}

export default Loader;
