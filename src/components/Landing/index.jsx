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
          <div className="landing-text">
          <p>
            <span>Envisioning a sustainable</span> green vision based movement which is necessarily inclusive of every buzz-word I can think of all in one sentence, the Carbon Collective brings to this vital community the evolution of environmental responsibility, fairness, egalitarianism, and hope.
          </p>
          </div>
          <button
            className="landing-button"
            onClick={this.newMemberSignUp}
          >GET INVOLVED</button>
      </div>
    )
  }
}




export default withRouter(Landing);
