  import React, { Component } from 'react';
import Apartment from './apartment';
import './AddHousehold-styles.css'
import { withRouter } from 'react-router-dom';
import { post } from '../../api_client'

const spaceTimer = function(data){
    var promise = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('success');
    }, 2000);
    })
    return promise;
  }


class AddHousehold extends Component {
  constructor() {
    super();
    let addressId = sessionStorage.getItem('address_id');
    this.state = {
      address_id: addressId,
      no_residents: 1,
      total_sq_ft: "not required",
      apartment: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleHouseholdForm = this.handleHouseholdForm.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.confirmData = this.confirmData.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }

  goToPage(path) {
    this.props.history.push(path)
  }

  resetForm() {
    this.setState({
      no_residents: 1,
      total_sq_ft: 0
    })
  }
  componentDidMount(){
    this.logLanding()
    // console.log(this.state)
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

  updateForm(name, data){
    this.setState({
      [name]: data
    })
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  confirmData(data){
    sessionStorage.setItem('house_id', data.id)
    this.props.addUserData()
    this.resetForm();
    spaceTimer(data)
      .then(data => this.goToPage('/dashboard'))
  }

  handleHouseholdForm(event) {
    event.preventDefault();
    let userId = sessionStorage.getItem('user_id');
    const householdData = {house: this.state, user_id: userId};
    //make API call to post new address
    const path = `houses`
    this.logPageChange(path)
    post(path, householdData)
      .then(data => this.confirmData(data))
      .catch(error => console.log(error))
  };

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

  updateResidents(e, type) {
    e.preventDefault();
    let newVal = this.state.no_residents;
    if (type === "add") {
      newVal += 1;
    } else if (newVal > 1) {
      newVal -= 1;
    }
    this.setState({ no_residents: newVal });
  }

  render() {
    let { no_residents, total_sq_ft } = this.state;

    const isFormValid = true;

    return (
      <form
        className="form-container add-household"
        onSubmit={ this.handleHouseholdForm }
      >
        <h3>Please add a bit more info about<br/>your household</h3>
        <h5>Number of Residents</h5>
        <label>
          <div className="number-form">
            <button
              onClick={ (e) => this.updateResidents(e) }
            >-</button>
            <input
              type="number"
              name="no_residents"
              step="1"
              min="1"
              max="1000"
              value={ no_residents }
              onChange={ this.handleChange }
            />
            <button
              onClick={ (e) => this.updateResidents(e, "add") }
            >+</button>
          </div>
        </label>
        <h5>Total Square Feet</h5>
        <label>
          <input
            type="number"
            className="sq-feet"
            name="total_sq_ft"
            placeholder="(not required)"
            step="any"
            min="0"
            max="50000"
            value={ total_sq_ft }
            onChange={ this.handleChange }
          />
        </label>
        <h5>Do you live in an apartment?</h5>
        <div className="toggle-container">
        <Apartment apartment={this.state.apartment} updateForm={this.updateForm}/>
        </div>
        <div className="button-containers">
          <button
            className="form-submit add-house-submit-btn"
            type="submit"
            name="add-household-form-submit"
            disabled={ !isFormValid }
          >Save Household</button>
        </div>
      </form>
    )
  };
};

export default withRouter(AddHousehold);
