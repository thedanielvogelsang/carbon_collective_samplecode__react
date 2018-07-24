import React, {Component} from 'react';
// import Select from 'react-select'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import {withRouter} from 'react-router-dom';
import {get, post} from '../../api_client';
import {renderFormStyles} from './form-search.js';
import './Neighborhood-styles.css';


class NeighborhoodInput extends Component{
  constructor(props){
    super(props);
    this.state = {
      city: localStorage.getItem('city_id'),
      cityName: '',
      neighborhood: -1,
      neighborhoods: null,
      loading: true,
      disabled: false,
      first: {class: 'text-show'},
      second: {class: 'hidden'},
      third: {class: 'hidden'},
      form: {class: 'hidden'},
      buttonFind: {class: "confirm-neighborhood-btn"},
      buttonForm: {class: "hidden"},
      clearbutton: {display: 'none'},
      thirdP: {class: "third-clause-p"},
      thirdH: {class: ""},
      nextBtn: 'none',
      header: true,
    }
    this.loadNeighborhoods = this.loadNeighborhoods.bind(this)
    this.loadCityName = this.loadCityName.bind(this);
    this.setNeighborhood = this.setNeighborhood.bind(this)
    this.setNeighborhoods = this.setNeighborhoods.bind(this)
    this.clearRegion = this.clearRegion.bind(this);
    this.neighborhoodPopup = this.neighborhoodPopup.bind(this);
    this.text2 = this.text2.bind(this);
    this.text3 = this.text3.bind(this);
    this.renderNeighborhoodForm = this.renderNeighborhoodForm.bind(this);
    this.backToRegionPick = this.backToRegionPick.bind(this);
    this.storeAndGoToAddressPage = this.storeAndGoToAddressPage.bind(this);
    this.goToAddressPage = this.goToAddressPage.bind(this);
    this.mapOptions = this.mapOptions.bind(this);
  }

  componentDidMount(){
    this.loadNeighborhoods(this.state.city)
    this.loadCityName(this.state.city)
  }

  componentDidUpdate(){
  }

  text2(){
    this.setState({
      first: {class: 'hidden'},
      second: {class: 'text-show'},
      header: false,
    })
  }

  text3(){
    this.setState({
      second: {class: 'hidden'},
      third: {class: 'text-show neighborhood-link-container'},
    })
  }

  clearRegion(){
    this.setState({neighborhood: null, disabled: false, clearbutton:{display: 'none'}})
  }

  loadNeighborhoods(id){
    get(`api/v1/areas/neighborhoods?city_id=${id}`)
        .then(data => this.setNeighborhoods(data))
        .catch(error => console.log(error))
  }

  loadCityName(id){
    get(`api/v1/areas/cities/show/${id}`)
      .then(data => this.setState({cityName: data.name}))
      .catch(error => console.log(error))
  }

  setNeighborhood(event){
    let id = event.target.value
    this.setState({neighborhood: id, disabled: true, nextBtn: 'flex'}  );
  }

  setNeighborhoods(data){
    this.setState({
      neighborhoods: data,
      loading: false
    })
  }

  mapOptions(data){
    if(data){
      const options = data.map((val, n) => {
        return (
              <option key={n} value={val.id} name={val.name} className="list-options">{val.name}</option>
            )
      })
      return options
    }else{
      return (
      <option className="empty"></option>
      )
    }
  }

  backToRegionPick(){
    this.logPageChange('/search_address')
    this.props.history.push('/search_address')
  }

  renderNeighborhoodForm(){
    alert('Make sure to come back to this tab once youve found your neighborhood!')
    window.open("https://www.denvergov.org/maps/map/neighborhoods");
    this.setState({
        welcomeStyle: {display: 'none'},
        third: {class: 'hidden'},
        form: {class: 'neighborhood-form-container'},
        header: true,
    })
    renderFormStyles("custom-select-neighborhood")
  }

  neighborhoodPopup(){
    this.setState({
      buttonFind: {class: 'hidden'},
      buttonForm: {class: 'confirm-neighborhood-btn'},
      thirdP: {class: 'hidden'},
      thirdH: {class: 'hidden'},
    })
  }

  storeAndGoToAddressPage(){
    let nId = this.state.neighborhood
    if(nId !== null && nId !== '' && nId !== -1){
      localStorage.setItem('neighborhood_id', nId)
      this.goToAddressPage()
    }else{
      return alert("You must choose a neighborhood to continue")
    }
  }

  goToAddressPage(){
    const path = '/add_address'
    this.logPageChange(path)
    this.props.history.push(path)
  }

  logPageChange(path){
    let id = sessionStorage.getItem('user_id')
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
    let header = this.state.header
    if(this.state.loading){
      return(
        <div></div>
      )
    }else{
      return(
        <div>
          {header ?
          <div className="neighborhood-header">
            <p>Neighborhood Select</p>
          </div> : <div></div> }
          <div className="neighborhood-welcome" style={this.state.welcomeStyle}>
            <div id="first-clause" className={this.state.first.class} onClick={this.text2}><h3 className="welcome-text">We at CarbonCollective are passionate about thinking locally -- as this is where we can impact the most change!</h3><p className="click-to-continue">Click to continue</p></div>
            <div id="second-clause" className={this.state.second.class} onClick={this.text3}><h3 className="welcome-text"> As such, we invite you to start thinking in terms of small localities -- like your neighborhood!</h3><p className="click-to-continue">Click to continue</p></div>
            <div id="third-clause" className={this.state.third.class}>
              <h3 className={this.state.thirdH.class}>
                We see you're in {this.state.cityName}.
              </h3>
              <p id="blw-p" className={this.state.thirdP.class}> Below you'll find a link to {this.state.cityName}'s officially recognized neighborhoods:</p>
              <button
              className={this.state.buttonFind.class}
              onClick={this.renderNeighborhoodForm}
              >Confirm Your Neighborhood</button>
              <p className={this.state.thirdP.class}> Please click the link above, type in your address, and confirm the name of your neighborhood before continuing...</p>
            </div>
          </div>
          <div className={this.state.form.class}>
            <form
            onSubmit={(e) => this.storeAndGoToAddressPage(e)}
            className="regional-form neighborhoods"
            >
            <div id="custom-select-neighborhood" className="custom-select" style={{display: this.state.cityDisplay, width: '250px', height: '100px'}}>
              <label>
              <h3></h3>
              <div>
                <select
                  id="neighborhoodform-input"
                  name="neighborhood-form-field"
                  value={this.state.neighborhood}
                  onChange={this.setNeighborhood}
                  className="regionform-input"
                  display="none"
                  required
                  >
                  <option value={-1} disabled>Select your option</option>
                  {this.mapOptions(this.state.neighborhoods)}
                </select>
              </div>
              </label>
            </div>
            <div className="regional-form-btns to-counties" style={{display: this.state.nextBtn}}>
              <button
              type="submit"
              className="searchNeighborhood-next"
              style={{display: this.state.nextBtn}}
              >Next</button>
              <MuiThemeProvider>
                <FontIcon className="material-icons" id="go-to-address-icon" onClick={(e) => this.goToAddressPage(e)}>arrow_forward</FontIcon>
              </MuiThemeProvider>
            </div>
            </form>
            <div className="regional-form-btns neighborhoods">
              <MuiThemeProvider>
                <FontIcon className="material-icons" id="region-start-over-icon" onClick={(e) => this.goToLanding(e)}>arrow_back</FontIcon>
              </MuiThemeProvider>
              <button
              className="region-start-over"
              onClick={(e) => this.backToRegionPick(e)}
              style={this.state.startOverBtn}
              >back to geo-locator</button>
            </div>
          </div>
       </div>
      )
    }
  }
}

export default withRouter(NeighborhoodInput);
