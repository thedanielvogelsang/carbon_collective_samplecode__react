import React, {Component} from 'react'
// import Select from 'react-select';
import {withRouter} from 'react-router-dom';
import {get} from '../../api_client';

class CountryInput extends Component{
  constructor(props){
    super(props);
    this.state = {
      country: -1,
      countryName: null,
      loading: true,
      countries: null,
      disabled: false,
      placeholder: "Type to Search Country List",
      backbutton: {
        display: 'none'
      },
      startOverBtn: this.props.startOverBtn
    }
    this.loadCountries = this.loadCountries.bind(this)
    this.setCountries = this.setCountries.bind(this)
    this.mapCountries = this.mapCountries.bind(this)
    this.setCountry = this.setCountry.bind(this)
    this.nextRegion = this.nextRegion.bind(this)
    this.seeValue = this.seeValue.bind(this)
    this.clearRegion = this.clearRegion.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.goToLanding = this.goToLanding.bind(this)
  }

  handleFocus(){
    this.setState({placeholder: 'Click Outside Dropdown to Close'})
  }
  handleBlur(){
    this.setState({placeholder: 'Type to Search'})
  }

  componentDidMount(){
    this.loadCountries()
  }

  componentDidUpdate(){
    // document.getElementById("regionform-input").setAttribute("aria-haspopup", "true").setAttribute("aria-expanded", "true")
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  clearRegion(){
    this.setState({country: '', disabled: false, backbutton:{display: 'none'}, placeholder: "Type to Search Country List"})
  }

  setCountry(event){
    // console.log(`Selected: ${newValue.label}`)
    let id = event.target.value
    this.setState({country: id, disabled:true, backbutton:{display: 'inline-block'}, placeholder: 'Type to Search'});
  }

  mapCountries(){
    let data = this.state.countries
    const countries = data.map((val, n) => {
      return (
            <option key={n} value={val.id} label={val.name} className="list-options">{val.id}</option>
          )
    })
    return countries
  }

  goToLanding(e){
    this.props.history.push('/')
  }

  nextRegion(event){
    let id = Number(this.state.country)
    if(id !== ''){
      return this.props.updateArea('country', id);
    }
    alert('You have to pick a country to continue!')
  }

  seeValue(value, event){
    console.log(value)
    console.log(event)
  }

  loadCountries(){
    return get('api/v1/areas/countries')
      .then(data => this.setCountries(data))
      .catch(error => console.log(error))
  }

  highlightMe(event){
    console.log(event)
  }

  setCountries(data){
    // const countries = data.map((val, n) => {
    //   return <option key={n} value={val.id} label={val.name} className="list-options" onHover={this.highlightMe}>{val.id}</option>
    // })
    let countries = data;
    this.setState({
      countries: countries,
      loading: false,
    })
  }

  render(){
    if(this.state.loading){
      return(
        <div>
        </div>
      )
    }else {
      let countryName = this.state.countryName;
      return(
        <div  className="hello">
          <div className='forward-backward-links-container'>
            <button
              className="region-next"
              onClick={this.clearRegion}
              style={this.state.backbutton}
              >Back </button>
            <button
              className="region-next clear-region"
              onClick={this.clearRegion}
              style={this.state.backbutton}
              >Clear {this.props.regionName}</button>
            <button
              type="submit"
              className="region-next"
              onClick={this.nextRegion}
              >Next </button>
          </div>
          {countryName ?
          <div>
            <h1>{this.state.countryName}</h1>
          </div> : null }
          <select
            className='countryForm'
            name="country-form-field"
            value={this.state.country}
            // options={this.state.countries}
            onChange={this.setCountry}
            id="regionform-input"
            disabled={this.state.disabled}
            // matchPos='any'
            // value={-1}
            placeholder={this.state.placeholder}
            // inputProps={{autoComplete: 'off', placeholder: 'type here and select below'}}
            // require={true}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            // isOpen={false}
            >
             <option value={-1} disabled>Select your option</option>
              {this.mapCountries()}
            </select>
            <div>
             <button
              className="region-start-over"
              onClick={(e) => this.goToLanding(e)}
              style={this.state.startOverBtn}
              >back to home</button>
            </div>
        </div>
      )
    }
  }
}

export default withRouter(CountryInput);
