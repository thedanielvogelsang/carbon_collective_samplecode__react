import React, {Component} from 'react';
import './AboutUs-styles.css';

class AboutUs extends Component{
  render(){
    return(
      <div className="aboutus-page">
        <div className="aboutus-div">
          <h1>About Carbon Collective</h1>
          <div className="aboutus-paragraphs">
            <h2>Our Mission:</h2>
              <p>We believe that addressing global climate change must be a collective endeavor. We seek to empower and incentivize others in the fight to save our future. As a collective, we can influence politics and face systemic problems head on. We realize that our greatest resources are our care for our families, care for our neighbors, care for our towns and cities, care for our cultural groups, care for our nations, care for all people...</p>
              <p>Care for our world. We want Carbon Collective to be a safe, collaborative environment for us to demonstrate our carbon accountability.</p>
              <div className="aboutus-quote-div">
                <div className="aboutus-quote-aligner">
                  <p className="aboutus-quote">Carbon Collective is a social network of all of us, working together and competing to reduce carbon footprint at every level of impact.</p>
                  <span>- Sven Ceelen, founder of Carbon Collective LLP</span>
                </div>
              </div>
            <h2>Our Community:</h2>
              <p>We are people who want our actions to reflect our beliefs. As we see increasing average temperatures, more extreme weather events, and massive people displacement, we choose to seek a path forward, together. We recognize that innovative technologies can serve us in organizing, sharing, and holding ourselves and each other accountable.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default AboutUs;
