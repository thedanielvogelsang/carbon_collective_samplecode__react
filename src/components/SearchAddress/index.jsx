import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {get, post} from '../../api_client';
import './SearchAddress-styles.css';
import {renderFormStyles} from './form-search.js';
import {renderSubFormStyles} from './form-search.js';
import {capitalizeFirstLetter} from '../../helper-scripts/textHelpers.js';
import {scrollTop} from '../../helper-scripts/screenHelpers.js';


function cleanId(id){
  if(id === -1 || Number(id) === -1){
    return null
  }else{
    return id
  }
}
class SearchAddressPage extends Component{
  constructor(){
    super();
    this.state = {
      countries: null,
      regions: null,
      cities: null,
      counties: null,
      country_id: -1,
      region_id: -1,
      city_id: -1,
      county_id: -1,
      loading: true,
      regionDisplay: "none",
      cityDisplay: "none",
      countyDisplay: "none",
      nextBtn: "none",
      message: false,
    }
    this.loadCountries = this.loadCountries.bind(this);
    this.loadRegions = this.loadRegions.bind(this);
    this.loadCities = this.loadCities.bind(this);
    this.loadCounties = this.loadCounties.bind(this);
    this.setCountry = this.setCountry.bind(this);
    this.setRegion = this.setRegion.bind(this);
    this.setCounty = this.setCounty.bind(this);
    this.setCity = this.setCity.bind(this);
    this.sendGeoData = this.sendGeoData.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
    this.goToNeighborhoods = this.goToNeighborhoods.bind(this);
    this.goToExpansionPage = this.goToExpansionPage.bind(this);
    this.sortRegionalTitle = this.sortRegionalTitle.bind(this);
  }

  componentDidMount(){
    this.loadCountries();
    this.logLanding();
    scrollTop()
  }

  componentDidUpdate(prevProps, prevState){
  }

  logLanding(){
    let id = this.props.id
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

  loadCountries(){
    return get('api/v1/areas/countries')
      .then(data => this.setCountries(data))
      .catch(error => console.log(error))
  }

  loadRegions(id){
    const path = `api/v1/areas/regions?country_id=${id}`
    return get(path)
      .then(data => this.setRegions(data))
      .catch(error => null)
  }

  loadCounties(id){
    if(Number(id) === 6){
      const path = `api/v1/areas/counties?region_id=${id}`
      return get(path)
      .then(data => this.setCounties(data))
      .catch(error => console.log(error))
    }
  }

  loadCities(id){
    if(Number(id) === 6){
      const path = `api/v1/areas/cities?region_id=${id}`
      return get(path)
        .then(data => this.setCities(data))
      .catch(error => console.log(error))
    }else{
      renderSubFormStyles('custom-select-city')
    }
  }

  setCountries(data){
    this.setState({
      countries: data,
      loading: false,
    }, () => renderFormStyles("custom-select-country"))
  }

  setRegions(data){
    this.setState({
      regions: data,
    }, () => renderSubFormStyles('custom-select-region'))
  }

  setCounties(data){
    this.setState({
      counties: data,
      countyDisplay: "block",
    }, () => renderSubFormStyles('custom-select-county'))
  }

  setCities(data){
    this.setState({
      cities: data,
      cityDisplay: 'block',
    }, () => renderSubFormStyles('custom-select-city'))
  }

  setCountry(event){
    var index = event.nativeEvent.target.selectedIndex;
    let name = event.nativeEvent.target[index].text
    let id = event.target.value
    id = parseInt(id, 10)
    if(id === 194){
      this.setState({country_id: id, selection: name, regionDisplay: 'block'}, () => this.loadRegions(id));
      scrollTop()
    }else{
      if(confirm(`Did you mean to choose ${name}?`)){
        this.sendGeoData('Country', id)
        this.setState({country_id: id, regionDisplay: 'block', cityDisplay: 'none', countyDisplay: 'none', region_id: -1, county_id: -1, city_id: -1, nextBtn: 'none'}, () => this.loadRegions(id))
        alert("Sorry, your region is not supported yet. We will let you know when it is!")
        this.props.history.push('/')
      }
      scrollTop()
    }
  }

  setRegion(event){
    var index = event.nativeEvent.target.selectedIndex;
    let id = event.target.value
    let name = event.nativeEvent.target[index].text
    id = parseInt(id, 10)
    if(Number(id) === 6){
      this.setState({region_id: id, selection: name, cities: null, city_id: -1, message: true, countyDisplay: 'block'}, () => this.loadCounties(id))
      scrollTop()
    }else{
      if(confirm(`Did you mean to choose ${name}?`)){
        this.sendGeoData('Region', id)
        this.setState({
          region_id: id,
          selection: name,
          message: true,
          countyDisplay: 'none',
          cityDisplay: 'block',
          city_id: -1,
          cities: null,
          nextBtn: 'none'
        }, () => this.loadCities(id))
        alert("Sorry, your region is not supported yet. We will let you know when it is!")
        this.props.history.push('/')
      }
      scrollTop()
    }
  }

  setCounty(event){
    let id = event.target.value;
    var index = event.nativeEvent.target.selectedIndex;
    let name = event.nativeEvent.target[index].text;
    if(Number(id) === 17){
      this.setState({county_id: id, selection: name, cities: null, city_id: -1, message: true, countyDisplay: 'block'}, () => this.loadCities(this.state.region_id))
    }else{
      if(confirm(`Did you mean to choose ${name}?`)){
        this.sendGeoData('County', id)
        alert("Sorry, your region is not supported yet. We will let you know when it is!")
        this.props.history.push('/')
      }
    }
    scrollTop()
  }

  setCity(event){
    var index = event.nativeEvent.target.selectedIndex;
    let id = event.target.value
    let name = event.nativeEvent.target[index].text
    this.setState({city_id: id, selection: name, message: false, nextBtn: 'block'})
    scrollTop()
  }

  sendGeoData(type, id){
    let uId = this.props.id
    let paramsData = {
      geographical_data: {
        area: type,
        id: id
      },
      user: {
        id: uId
      }
    }
    const path = 'store_geo'
    post(path, paramsData)
      .then(data => console.log())
      .catch(error => console.log(error))
  }

  mapOptions(data){
    if(data){
      const options = data.map((val, n) => {
        return (
              <option key={n} value={val.id} name={val.name} className="list-options">{val.name}</option>
            )
      })
      return options
    }
  }

  goToExpansionPage(){
    let country_id = cleanId(this.state.country_id)
    let region_id = cleanId(this.state.region_id)
    let city_id = cleanId(this.state.city_id)
    let county_id = cleanId(this.state.county_id)
    const geog = {
      country_id,
      region_id,
      city_id,
      county_id,
    }
    localStorage.setItem("user_details", JSON.stringify(geog))
    this.logPageChange('/expand-resquest')
    this.props.history.push('/expand-request')
  }

  goToNeighborhoods(e){
    e.preventDefault();
    let countyid = cleanId(this.state.county_id)
    let cityid = cleanId(this.state.city_id)
    localStorage.setItem("county_id", countyid)
    localStorage.setItem("city_id", cityid)
    this.logPageChange('/add_neighborhood')
    this.props.history.push('/add_neighborhood')
  }

  goToLanding(e){
    this.logPageChange('/landing')
    this.props.history.push('/')
  }

  assumeRegionName(id){
    id = Number(id)
    if(id === 194){
      return 1
    }else if(id === 33){
      return 2
    }
  }

  sortRegionalTitle(id){
    let regionName;
    switch(this.assumeRegionName(id)){
      case 1:
        regionName = "state"
        break
      case 2:
        regionName = "province"
        break
      default:
        regionName = "region"
    }
    return regionName
  }

  logPageChange(path){
    let id = this.props.id
    let page = this.props.history.location.pathname
    let url = `${id}/page-leave`
    let datum = {user_behavior: {
      prevPage: page,
      nextPage: path,
        }
      }
    post(url, datum)
     .then(data => console.log())
     .catch(error => console.log(error))
  }


  render(){
    let loading = this.state.loading;
    let message = this.state.message;
    let id = this.state.country_id
    let name = this.sortRegionalTitle(id);
    let nameCap = capitalizeFirstLetter(name);
    if(name === "Region" && id !== -1){
      message = true;
    }
    if(loading){
        return(
        <div></div>
      )
    }else{
      return(
        <div className="address-signup-expander">
        <div  className="search_address_page">
          <h1>Help us locate your house</h1>
          <form
            onSubmit={(e) => this.goToNeighborhoods(e)}
            className="regional-form"
            >
            <div id="custom-select-country" className="custom-select" style={{width: '250px', height: '100px'}} >
              <label>
              <h3>Countries</h3>
              <div>
              <select
                id='country-select'
                name="country-form-field"
                value={this.state.country_id}
                onChange={this.setCountry}
                className="regionform-input"
                display="none"
                required
                >
                 <option value={-1}>Select yours...</option>
                  {this.mapOptions(this.state.countries)}
              </select>
              </div>
              </label>
            </div>
            <div id="custom-select-region" className="custom-select" style={{display: this.state.regionDisplay, width: '250px', height: '100px'}}>
              <label>
                <h3>{nameCap}s</h3>
                <div>
                  <select
                    id='region-select'
                    name="region-form-field"
                    value={this.state.region_id}
                    onChange={this.setRegion}
                    className="regionform-input"
                    display="none"
                    required
                    >
                     <option value={-1} disabled>Select yours...</option>
                     {this.mapOptions(this.state.regions)}
                  </select>
                </div>
              </label>
            </div>
            <div id="custom-select-county" className="custom-select" style={{display: this.state.countyDisplay, width: '250px', height: '100px'}}>
              <label>
              <h3>Counties</h3>
              <div>
              <select
                id='county-select'
                name="region-form-field"
                value={this.state.county_id}
                onChange={this.setCounty}
                className="regionform-input"
                display="none"
                required
                >
                 <option value={-1} disabled>Select yours...</option>
                 {this.mapOptions(this.state.counties)}
                </select>
                </div>
              </label>
            </div>
            <div id="custom-select-city" className="custom-select" style={{display: this.state.cityDisplay, width: '250px', height: '100px'}}>
              <label>
                <h3>Cities</h3>
                <div>
                  <select
                  id='city-select'
                  name="region-form-field"
                  value={this.state.city_id}
                  onChange={this.setCity}
                  className="regionform-input"
                  display="none"
                  required
                  >
                  <option value={-1} disabled>Select yours...</option>
                  {this.mapOptions(this.state.cities)}
                  </select>
                </div>
              </label>
            </div>
            {message ?
            <div className="city-notThere-container">
              <h3 className="city-notThere-message">Don't see your area?</h3>
              <button className="expansion-link" onClick={() => this.goToExpansionPage()}>Contact Us</button>
            </div> : null}
            <div className="regional-form-btns" style={{display: this.state.nextBtn}}>
                <button
                  type="submit"
                  className="searchAddress-next"
                  onClick={(e) => this.goToNeighborhoods(e)}
                  >Choose Neighborhood
                </button>
            </div>
          </form>
         </div>
       </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return({
    id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
  })
}

export default withRouter(connect(mapStateToProps, null)(SearchAddressPage));
