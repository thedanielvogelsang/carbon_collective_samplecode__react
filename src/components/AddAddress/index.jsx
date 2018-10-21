import React, { Component } from 'react';
import './AddAddress-styles.css'
import { withRouter } from 'react-router-dom';
import {fetchUserData} from '../../actions/userActions'
import { connect } from 'react-redux';
import { countries } from '../utilities';
import { get, post } from '../../api_client'

class AddAddress extends Component {
  constructor() {
    super();
    let city_id = localStorage.getItem('city_id')
    let neighborhood_id = localStorage.getItem('neighborhood_id')
    let county_id = localStorage.getItem('county_id')
    this.state = {
      message: "Please enter your address below",
      messageColor: {color: '#89868d', fontSize: '24px'},
      address_line1: "",
      address_line2: "",
      move_in_date: "",
      city_id: city_id,
      city: "",
      region: "",
      country: "",
      zip: "",
      neighborhood_id: neighborhood_id,
      county_id: county_id,
      loading: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddressForm = this.handleAddressForm.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.setSession = this.setSession.bind(this);
    this.setAddressComponents = this.setAddressComponents.bind(this);
    this.catchError = this.catchError.bind(this);

  }

  componentDidMount(){
    this.logLanding()
    get(`api/v1/areas/cities/show/${this.state.city_id}`)
      .then(data => this.setAddressComponents(data))
      .catch(error => console.log(error))
  }

  setAddressComponents(cityData){
    this.setState({
      city: cityData.name,
      region: cityData.parent,
      loading: false,
    })
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

  goToPage(path) {
    this.props.history.push(path)
  }

  resetForm() {
    this.setState({
      message: "Please enter your address below",
      messageColor: {color: '#89868d'},
      address_line1: "",
      address_line2: "",
      city: "",
      region: "",
      country: "",
      zip: "",
      neighborhood_id: "",
      loading: false,
    })
  }

  generateCountryOptions() {
    return countries.map((country, i) => {
      return (
        <option key={ i } value={ country }>{ country }</option>
      )
    }
  )}

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  setSession(data){
    this.props.fetchUserData(this.props.id)
    this.resetForm();
    this.logPageChange('/dashboard')
    // console.log('setting page', Date())
    setTimeout(this.goToPage, 2000, '/dashboard');
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

  handleAddressForm(event) {
    event.preventDefault();
    let id = this.props.id
    let move_in_date = this.state.move_in_date
    let addressData = {
      address_line1: this.state.address_line1,
      address_line2: this.state.address_line2,
      city_id: this.state.city_id,
      county_id: this.state.county_id,
      neighborhood_id: this.state.neighborhood_id,
      };
    addressData = {address: addressData, zipcode: this.state.zip, user_id: id, move_in_date: move_in_date};
    const apiPath = `addresses`
    let addressConf = `${this.state.address_line1}, ${this.state.city}, ${this.state.region} ${this.state.zip}`
    //make API call to post new address
    if(confirm(`We have your address as: ${addressConf}. Please confirm that this is accurate`)){
      post(apiPath, addressData)
        .then(data => this.setSession(data))
        .catch(error => this.catchError(error))
    }else{
      alert('Please fix your address and try again')
    }

  };

  catchError(error){
    if(error.errors !== 'House already exists'){
      this.setState({message: error.errors, messageColor: {color: "#ED3838"}})
    }else{
      let hid = error.house
      localStorage.setItem("temp_house", hid)
      this.goToPage('/house-exists')
    }
  }

  render() {
    let loading = this.state.loading;
    if(loading){
      return(
        <div>
        </div>
      )
    }
    return (
    <div className='add-address-page'>
      <form
        className="form-container add-address"
        onSubmit={ this.handleAddressForm }
      >
        <h4 style={this.state.messageColor}>{this.state.message}</h4>
        <label>
          <input
            type="text"
            autoFocus
            required={ true }
            spellCheck="true"
            inputMode="text"
            name="address_line1"
            placeholder="Address line 1"
            onChange={ this.handleChange }
          />
        </label>
        <label>
          <input
            type="text"
            required={ false }
            spellCheck="true"
            inputMode="text"
            name="address_line2"
            placeholder="Address line 2"
            onChange={ this.handleChange }
          />
        </label>
        <label>
          <input
            type="text"
            required={ true }
            inputMode="numeric"
            name="zip"
            placeholder="Zipcode"
            onChange={ this.handleChange }
          />
        </label>
        <label>
            <h5 className="movein-label">When did you move in?</h5>
            <input
              id="movein-calendar"
              required="true"
              type="date"
              name="move_in_date"
              onChange={ this.handleChange }
              />
        </label>
        <div className="button-containers address-button-container">
        <button
        className="form-submit address-submit"
        type="submit"
        name="add-address-form-submit"
        >Save Address</button>
        </div>
      </form>
    </div>
    )
  };
};

const mapStateToProps = (state) => {
  return({
    id: state.userInfo.user_id,
    resource_type: state.userInfo.resource_type,
  })
}

export default withRouter(connect(mapStateToProps, {fetchUserData})(AddAddress));
