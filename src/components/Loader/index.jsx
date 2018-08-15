import React, {Component} from 'react';
import "./loader-styles.css"


export default class Loader extends Component{
  render(){
    return(
      <div className="app-container">
        <div className="loader"></div>
      </div>
    )
  }
}
