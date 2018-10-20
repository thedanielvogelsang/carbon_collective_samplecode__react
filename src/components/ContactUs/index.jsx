import React, {Component} from 'react';
import './ContactUs-styles.css'
// import {withRouter} from 'react-router-dom';


class ContactUs extends Component{
  render(){
    return(
      <div className="contactus-page">
        <div className="contactus-div">
          <h1>Contact us.</h1>
            <div className="contactus-paragraphs">
              <div className="contactus-welcome-div">
                <p className="contactus-welcome"><span className="contactus-welcome">Are you a community organizer,</span> head of a nonprofit or part of an environmentally-conscious network? Please contact us so we can expedite your invite process. All others please also feel free to reach out with questions or comments.</p>
              </div>
              <div className="contactus-portrait-div">
                <img
                  className="contactus-portrait"
                  alt="carbon collective founder portrait photo"
                  src={require(`./svenportrait.jpg`)}
                  />
              </div>
              <div className="contactus-quote-div">
                <p className="contactus-quote email">svenceelen@gmail.com</p>
                <p className="contactus-quote"><span>720-255-3692</span></p>
                <div className="contactus-quote-aligner">
                  <span>- Sven Ceelen, founder of Carbon Collective LLC</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}


export default ContactUs;
