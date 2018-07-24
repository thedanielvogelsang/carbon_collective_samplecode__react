import React, {Component} from 'react';
import './WaitConfirm-styles.css';

class WaitConfirm extends Component{
  render(){
    return(
      <div className="wait-confirm-page">
        <h1> Please click the link in the email we just sent you to confirm your account</h1>
      </div>
    )
  }
}

export default WaitConfirm;
