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
            <span className="opening-line">Envisioning and fostering</span> an empowered, global community ready to transform our world through collective and strategic action. <span className="span-cc-name">Carbon Collective</span>&apos;s vision is a necessarily inclusive movement which aims, above all, to work together to <span className='italics'>revolutionize</span> humanity's relationship with the natural world, in favor of a collective symbiosis founde on: environmental responsibility, fairness, egalitarianism, and hope.
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
