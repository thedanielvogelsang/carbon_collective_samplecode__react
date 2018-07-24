import React, { Component } from 'react';
import './AddAddress-styles.css'
import { withRouter } from 'react-router-dom';
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
      messageColor: {color: '#1fa245', fontFamily: 'PT Serif', fontSize: '1em'},
      address_line1: "",
      address_line2: "",
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

  goToPage(path) {
    this.props.history.push(path)
  }

  resetForm() {
    this.setState({
      message: "Please enter your address below",
      messageColor: {color: '#1fa245'},
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
    sessionStorage.setItem('address_id', data.id);
    sessionStorage.setItem('house_id', data.house.id);
    this.resetForm();
    this.logPageChange('/dashboard')
    this.goToPage('/dashboard');
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

  handleAddressForm(event) {
    event.preventDefault();
    let id = sessionStorage.getItem('user_id')
    let addressData = {
      address_line1: this.state.address_line1,
      address_line2: this.state.address_line2,
      city_id: this.state.city_id,
      county_id: this.state.county_id,
      neighborhood_id: this.state.neighborhood_id,
      };
    addressData = {address: addressData, zipcode: this.state.zip, user_id: id};
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
          <h5>Address Line 1</h5>
          <input
            type="text"
            autoFocus
            required={ true }
            spellcheck="true"
            inputMode="text"
            name="address_line1"
            onChange={ this.handleChange }
          />
        </label>
        <label>
          <h5>Address Line 2</h5>
          <input
            type="text"
            required={ false }
            spellcheck="true"
            inputMode="text"
            name="address_line2"
            onChange={ this.handleChange }
          />
        </label>
        <label>
          <h5>Zipcode</h5>
          <input
            type="text"
            required={ true }
            inputMode="numeric"
            name="zip"
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

export default withRouter(AddAddress);
