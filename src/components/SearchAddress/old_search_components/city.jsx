import React, {Component} from 'react'
import Select from 'react-select';
import {withRouter} from 'react-router-dom';
import {get} from '../../api_client';

class CityInput extends Component{
  constructor(props){
    super(props);
    this.state = {
      city: this.props.id,
      region: this.props.region,
      cities: null,
      loading: true,
      disabled: false,
      backbutton: {
        display: 'inline-block'
      },
      clearbutton: {
        display: 'none'
      },
      startOverBtn: this.props.startOverBtn,
      noCity: {
        display: 'none'
      }
    }
    this.nextArea = this.nextArea.bind(this)
    this.setCity = this.setCity.bind(this)
    this.setCitys = this.setCities.bind(this)
    this.showBtn = this.showBtn.bind(this)
    this.loadCitys = this.loadCities.bind(this)
    this.backToRegion = this.backToRegion.bind(this)
    this.clearRegion = this.clearRegion.bind(this)
    this.goToLanding = this.goToLanding.bind(this)
    this.showMessage = this.showMessage.bind(this)
    this.goToExpansionPage = this.goToExpansionPage.bind(this)
  }

  componentDidMount(){
    this.loadCities(this.state.region)
  }

  componentDidUpdate(){
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  nextArea(){
    let id = this.state.city
    if(id !== ''){
      return this.props.updateArea('city', id)
    }
    alert("You gotta pick a city!")
  }

  clearRegion(){
    this.setState({city: '', disabled: false, clearbutton:{display: 'none'}})
  }

  setCity(newValue){
    let id = newValue.value
    this.setState({city: id, disabled: true, clearbutton:{display: 'inline-block'}, startOverBtn: {display: 'inline-block'}, noCity: {display: 'none'}});
  }

  backToRegion(){
    this.props.updateArea('region', "")
  }

  loadCities(id){
    localStorage.setItem("region_id", id)
    return get(`api/v1/areas/cities?region_id=${id}`)
      .then(data => this.setCities(data))
      .catch(error => console.log(error))
  }

  setCities(data){
    const cities = data.map((val) => {
      return {value: val.id, label: val.name, className: "list-options"}
    })
    this.setState({
      cities: cities,
      loading: false,
    })
  }

  goToLanding(){
    console.log('trying')
    this.props.history.push('/')
  }

  goToExpansionPage(){
    this.props.history.push('/expand-request')
  }

  showMessage(){
    this.setState({
      noCity:{
        display: 'block',
      },
      startOverBtn: {
        display: 'none'
      }
    })
  }

  showBtn(){
    this.setState({
      noCity:{
        display: 'none',
      },
      startOverBtn:{
        display: 'inline-block'
      },
    })
  }

  render(){
    if(this.state.loading){
      return(
        <div>
        </div>
      )
    }else {
      if(this.state.region !== 6){
        return(
          <div>
            <div id="unregistered-region-error">
              <h3> We're Sorry! It seems CarbonCollective hasn't yet expanded to your city!</h3>
            </div>
            <div className='forward-backward-links-container'>
            <button
              className="region-next"
              onClick={this.backToRegion}
              style={this.state.backbutton}
              >Back</button>
             <button
              className="region-start-over"
              onClick={this.goToLanding}
              style={this.state.startOverBtn}
              >back to home</button>
            </div>
          </div>
        )
      }else{
        return(
          <div>
            <div className='forward-backward-links-container'>
              <button
                className="region-next"
                onClick={this.backToRegion}
                style={this.state.backbutton}
                >Back</button>
              <button
                className="region-next clear-region"
                onClick={this.clearRegion}
                style={this.state.clearbutton}
                >Clear {this.props.regionName}</button>
              <button
                className="region-next"
                onClick={this.nextArea}
                >Next </button>
            </div>
            <Select
              className='cityForm'
              name="city-form-field"
              value={this.state.city}
              options={this.state.cities}
              onChange={this.setCity}
              disabled={this.state.disabled}
              onFocus={this.showMessage}
              onBlur={this.showBtn}
              id="regionform-input"
              inputProps={{autoComplete: 'off', placeholder: 'type here and select below'}}
              />
              <div className="city-notThere-container">
                <h3 className="city-notThere-message" style={this.state.noCity}>Don't see your city listed?
                Contact our developers <span className="expansion-link" onClick={() => this.goToExpansionPage()}>here</span> to suggest we expand to your city asap!</h3>
              </div>
              <div>
               <button
                id="city-region-start-over"
                className="region-start-over"
                onClick={this.goToLanding}
                style={this.state.startOverBtn}
                >back to home</button>
              </div>
          </div>
        )
      }
    }
  }
}

export default withRouter(CityInput);
