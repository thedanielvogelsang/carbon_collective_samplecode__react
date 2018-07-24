import React, {Component} from 'react'
// import Select from 'react-select';
import {withRouter} from 'react-router-dom';
import {get} from '../../api_client';


class RegionInput extends Component{
  constructor(props){
    super(props);
    this.state = {
      country: this.props.country,
      region: this.props.id,
      regions: null,
      loading: true,
      disabled: false,
      placeholder: `Type to Search for your ${this.props.regionName}`,
      backbutton: {
        display: 'inline-block'
      },
      clearbutton: {
        display: 'none'
      },
      startOverBtn: this.props.startOverBtn,
    }
    this.nextRegion = this.nextRegion.bind(this)
    this.setRegion = this.setRegion.bind(this)
    this.setRegions = this.setRegions.bind(this)
    this.loadRegions = this.loadRegions.bind(this)
    this.clearRegion = this.clearRegion.bind(this)
    this.backToCountryPick = this.backToCountryPick.bind(this)
    this.logMissingCountry = this.logMissingCountry.bind(this)
    this.goToLanding = this.goToLanding.bind(this)
  }

  componentDidMount(){
    console.log(this.props)
    this.loadRegions(this.props.country)
  }

  componentDidUpdate(){
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  nextRegion(){
    let id = this.state.region
    if(id !== ''){
      this.setState({startOverBtn:{display: 'none'}})
      return this.props.updateArea('region', id)
    }
    alert("You have to pick a state/province!")
  }

  goToLanding(){
    this.props.history.push('/')
  }

  backToCountryPick(){
    this.props.updateArea('country', '')
  }

  clearRegion(){
    this.setState({region: '', disabled: false, clearbutton:{display: 'none'}})
  }

  setRegion(newValue){
    let id = newValue.value
    this.setState({region: id, disabled: true, clearbutton:{display: 'inline-block'}});
  }

  loadRegions(id){
    return get(`api/v1/areas/regions?country_id=${id}`)
      .then(data => this.setRegions(data))
      .catch(error => console.log(error))
  }

  logMissingCountry(){
    console.log('country logged', this.state.country)
  }

  setRegions(data){
    const regions = data.map((val) => {
      return (
        <option value={val.id} label={val.name} className="list-options">{val.id}</option>
      )
    })
    this.setState({
      regions: regions,
      loading: false,
    })
  }

  render(){
    if(this.state.loading){
      return(
        <div>
        </div>
      )
    }else{
      // have to remember that this is our current stop filter for countries on search_address
      if(this.state.country !== 194){
        return(
          <div>
            <div id="unregistered-region-error">
              <h3> We're Sorry! It seems CarbonCollective hasn't yet expanded to your country!</h3>
            </div>
            <div className='forward-backward-links-container'>
            <button
              className="region-next"
              onClick={this.backToCountryPick}
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
                onClick={this.backToCountryPick}
                style={this.state.backbutton}
                >Back</button>
              <button
                className="region-next clear-region"
                onClick={this.clearRegion}
                style={this.state.clearbutton}
                >Clear</button>
              <button
                className="region-next"
                onClick={this.nextRegion}
                >Next </button>
            </div>
            <select
              className='regionForm'
              name="region-form-field"
              value={this.state.region}
              options={this.state.regions}
              onChange={this.setRegion}
              placeholder={this.state.placeholder}
              id="regionform-input"
              inputProps={{autoComplete: 'off', placeholder: "type here and select below"}}
              disabled={this.state.disabled}
              />
              <div>
               <button
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

export default withRouter(RegionInput)
