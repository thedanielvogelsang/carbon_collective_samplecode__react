import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux'
import {removeUserHouse} from '../../actions/userActions'
import {get, put, post} from '../../api_client';
import './HouseSettings-styles.css';

const setTimer = function(data){
    let promise = new Promise(function(resolve, reject){
      setTimeout(function(){
        console.log(data);
        resolve('success');
    }, 2000);
    })
    return promise;
  }

class HouseSettings extends Component{
  constructor(){
    super()
    this.state = {
      addressLoaded: false,
      errors: "",
      errorStyle: {display: 'none'},
      house_exists: true,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUserHouseChange = this.handleUserHouseChange.bind(this);
    this.updateResidents = this.updateResidents.bind(this);
    this.updateHouseDetails = this.updateHouseDetails.bind(this);
    this.addressForm = this.addressForm.bind(this);
    this.removeUserHouse = this.removeUserHouse.bind(this);
    this.goToDashboard = this.goToDashboard.bind(this)
    this.goToUserSettings = this.goToUserSettings.bind(this)
    this.disappear = this.disappear.bind(this);
    this.setNoHouseState = this.setNoHouseState.bind(this);
    this.clearAndGoToDash = this.clearAndGoToDash.bind(this);
  }

  componentDidMount(){
    this.logLanding()
    let house = this.props.userData.household
    if(house !== null){
      const path = `api/v1/addresses/${this.props.userData.household.address_id}`
      get(path)
        .then(data => this.setAddressState(data))
        .catch(error => console.log(error))
    }else(
      this.setNoHouseState()
    )
  }

  componentDidUpdate(){
    console.log(this.state)
  }

  logLanding(){
    let id = this.props.user_id
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

  setNoHouseState(){
    this.setState({
      house_exists: false
    })
  }

  handleChange(event){
    const house = this.state.house
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(value === ''){
      let origVal = house[name]
      target.placeholder = origVal
    }else{
        house[name] = value
        this.updateHouseDetails(house)
    }
  }

  handleUserHouseChange(event){
    const house = this.state.house
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(value === ''){
      let origVal = house[name]
      target.placeholder = origVal
    }else{
        house[name] = value
        this.updateUserHouseDetails(house)
    }
  }

  setAddressState(addressHash){
    const path = `api/v1/houses/${this.props.house_id}?user_id=${this.props.user_id}`;
    get(path)
      .then(data => this.setState({
      full_address: addressHash.full_address,
      addressLoaded: true,
      house_id: this.props.userData.house_ids[0],
      user_id: this.props.userData.id,
      house: data,
      neighborhood: addressHash.neighborhood,
      county: addressHash.county,
      no_users: data.no_users,
    }))
      .catch(error => console.log(error))
  }

  removeUserHouse(){
    let id = this.state.user_id
    let hId = this.state.house_id
    if(confirm("Are you sure you want to remove your house from your profile? Warning:: You can't undo this.")){
      this.props.removeUserHouse(id, hId)
    }else{
      this.forceUpdate()
    }
  }

  clearAndGoToDash(data){
    // perhaps here we need to remove house_id from Redux state
    setTimer(data)
      .then(data => this.goToDashboard())
      .catch(error => console.log(error))
  }

  goToDashboard(){
    let path = '/dashboard'
    this.props.history.push(path)
  }

  goToUserSettings(){
    let path = '/user_settings'
    this.props.history.push(path)
  }

  updateResidents(e, type) {
    e.preventDefault();
    let userCt = this.state.no_users;
    let newVal = this.state.house.no_residents;
    if (type === "add") {
      newVal += 1;
      e.target.placeholder = newVal
    } else if (newVal > userCt) {
      newVal -= 1;
      e.target.placeholder = newVal
    }
    let house = this.state.house
    house.no_residents = newVal
    this.updateHouseDetails(house)
    // this.setState({ house: house });
  }

  updateHouseDetails(house){
    if(confirm("Are you sure? This effects everyone in the house.")){
      const path = `api/v1/houses`
      const houseData = {house: house}
      const id = this.state.house_id
      put(path, id, houseData)
        .then(data => this.setState({house: data, errors: "house details saved", errorStyle: {display: 'block'}}))
        .catch(error => this.setState({errors: 'house could not be saved'}))
    }
  }

  updateUserHouseDetails(house){
    const path = `api/v1/houses`
    const user_id = this.props.user_id
    const houseData = {user_house: house, user_id: user_id}
    const id = this.state.house_id
    put(path, id, houseData)
      .then(data => this.setState({house: data, errors: "house details saved", errorStyle: {display: 'block'}}))
      .catch(error => this.setState({errors: 'house could not be saved'}))
  }

  disappear(){
    this.setState({errors: ""})
  }

  addressForm(){
    return(
      <div className="deleteHouse-container">
        <div className="current-address">
          <h5 className='current-address'> Current Address: </h5>
          <h4> {this.state.full_address} </h4>
        </div>
        <div className="current-address">
          <h5 className='current-address'> Neighborhood: </h5>
          <h4> {this.state.neighborhood.name} </h4>
        </div>
        <div className="current-address">
          <h5 className='current-address'> County: </h5>
          <h4> {this.state.county.name} </h4>
        </div>
        <div className='houseDelete'>
          <button
            className="deleteHouse"
            name="remove-house-btn"
            onClick={this.removeUserHouse}
            >Click To Remove House</button>
        </div>
        <div>
          <button
            className="address-link"
            onClick={this.goToUserSettings}
            >User Info</button>
        </div>
      </div>
    )
  }

  render(){
    let addressLoaded = this.state.addressLoaded
    if(this.state.house_exists && addressLoaded){
      return(
        <div className="houseSettings-container">
          <div className="housesettings-error-box" onClick={this.disappear} style={this.state.errorStyle}>
            { this.state.errors }
          </div>
          <h1 className="edit-header house-settings">House Settings</h1>
          <h2 className="edit-header current-settings">Editable Details</h2>
          <form
            className="form-container house-editform"
            >
              <h5> Current Number of Residents </h5>
              <label>
                <div className="number-form">
                  <button
                    onClick={ (e) => this.updateResidents(e) }
                  >-</button>
                  <input
                    id="noRes-id"
                    type="text"
                    name="no_residents"
                    step="1"
                    min="1"
                    max="1000"
                    readOnly={true}
                    placeholder={ this.state.house.no_residents }
                    onBlur={ this.handleChange }
                  />
                  <button
                    onClick={ (e) => this.updateResidents(e, "add") }
                  >+</button>
                </div>
              </label>
              <h5>Move in Date</h5>
              <label>
                <input
                  id="move-in"
                  required="false"
                  type="date"
                  name="move_in_date"
                  onChange={ this.handleUserHouseChange }
                />
              </label>
              <h5>Total Square Feet</h5>
              <label>
                <input
                  id="sq-ft"
                  type="number"
                  className="sq-feet"
                  name="total_sq_ft"
                  placeholder={ this.state.house.total_sq_ft }
                  step="1"
                  min="0"
                  max="50000"
                  onFocus={(e) => e.target.placeholder = ''}
                  onBlur={ this.handleChange }
                />
              </label>
            </form>
          <h2 className="edit-header current-settings">Static Details</h2>
            { addressLoaded ? this.addressForm() : null }
        </div>
      )
    }else{
      return(
        <div className="wait-confirm-page">
          <h1>No house/address on file. Return to dashboard</h1>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    move_in_date: state.userInfo.move_in_date
  })
}

export default withRouter(connect(mapStateToProps, {removeUserHouse})(HouseSettings));
