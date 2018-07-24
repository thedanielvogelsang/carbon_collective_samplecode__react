import React, {Component} from 'react';
import './CarbonCalculations-styles.css';
import {post} from '../../api_client';

class CarbonCalculations extends Component{
  constructor(){
    super();
    this.state ={

    }
    this.goToCarbonFund = this.goToCarbonFund.bind(this);
  }

  componentDidMount(){
    this.logLanding()
  }

  goToCarbonFund(){
    window.open("https://www.carbonfund.org/how-we-calculate")
  }

  logLanding(){
    let id = sessionStorage.getItem('user_id')
    let page = this.props.history.location.pathname
    let path = `${id}/page-land`
    let datum = {user_behavior: {
      pageName: page,
        }
      }
    post(path, datum)
     .then(data => console.log())
     .catch(error => console.log(error))
  }

  render(){
    return(
      <div className="carbon-calcs-page">
      <div className="carbon-calcs-notice">
        <div className="carbon-calcs-header">
          <h1>Carbon Conversions</h1>
        </div>
        <div className="carbon-calcs-text">
          <p className="carbon-calculation">
            1 kWh = 1.222lbs CO2
          </p>
          <p className="carbon-calculation">
            1 therm = 12.081332lbs CO2
          </p>
          <p className="carbonfund-link-p">source: <a href="" onClick={this.goToCarbonFund} name="carbonfund-link" className="carbonfund-link">carbonfund.org</a></p>
        </div>
      </div>
      </div>
    )
  }
}

export default CarbonCalculations;
