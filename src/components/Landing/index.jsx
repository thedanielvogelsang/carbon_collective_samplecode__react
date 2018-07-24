import React, { Component } from 'react';
import { withRouter } from "react-router-dom"

import './Landing-styles.css';

class Landing extends Component {

  constructor() {
    super();
    this.goToPage = this.goToPage.bind(this);
    this.newMemberSignUp = this.newMemberSignUp.bind(this);
  }

  goToPage(path) {
    this.props.history.push(path)
  }

  newMemberSignUp() {
    window.open('http://eepurl.com/dBEQe9')
    // this.props.history.push('/signup')
  }

  render() {
    return (
      <div className='landing-body'>
        <div className="earth-container">
          <img
          className="cc-landing-img"
          alt="app logo"
          src="./img/Leaf final_fill.png"
          />
        </div>
        <div className="button-containers landing-button">
        <div>
        <a className="new-member-link" onClick={this.newMemberSignUp}>- not a CC member yet? -</a>
        </div>
          <button
            className="landing-button"
            onClick={(e) => this.goToPage('/login') }
          >Sign in</button>
        </div>
      </div>
    )
  }
}




export default withRouter(Landing);
