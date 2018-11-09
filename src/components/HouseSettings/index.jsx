import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux'
import {removeUserHouse} from '../../actions/userActions'
import {get, put, post} from '../../api_client';
import './HouseSettings-styles.css';

const setTimer = function(data){
    let promise = new Promise(function(resolve, reject){
      setTimeout(function(){
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
      house: {move_in_date: "", no_residents: 1},
    }
    this.handleChange = this.handleChange.bind(this);
    this.updateResidents = this.updateResidents.bind(this);
    this.updateHouseDetails = this.updateHouseDetails.bind(this);
    this.updateUserHouseDetails = this.updateUserHouseDetails.bind(this);
    this.addressForm = this.addressForm.bind(this);
    this.removeUserHouse = this.removeUserHouse.bind(this);
    this.goToDashboard = this.goToDashboard.bind(this)
    this.goToUserSettings = this.goToUserSettings.bind(this)
    this.disappear = this.disappear.bind(this);
    this.setNoHouseState = this.setNoHouseState.bind(this);
    this.clearAndGoToDash = this.clearAndGoToDash.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
  }

  componentDidMount(){
    this.logLanding()
    let house = this.props.userData.data.household
    if(house !== null){
      const path = `api/v1/addresses/${house.address_id}`
      get(path)
        .then(data => this.setAddressState(data))
        .catch(error => console.log(error))
    }else(
      this.setNoHouseState()
    )
  }

  componentDidUpdate(){
    return this.state.errors !== "" ? this.countdownClear() : null
  }

  countdownClear(){
    setTimeout(this.clearErrors, 3000)
  }

  clearErrors(){
    this.setState({errors: "", errorStyle: {display: 'none'}})
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

  // used for onChange to update state
  handleChange(event){
    let house = this.state.house
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(value === ''){
      let origVal = house[name]
      target.placeholder = origVal
    }else{
      house[name] = value
      this.setState({
        house: house,
      })
    }
  }

  setAddressState(addressHash){
    const path = `api/v1/houses/${this.props.house_id}?user_id=${this.props.user_id}`;
    get(path)
      .then(data => this.setState({
      full_address: addressHash.full_address,
      addressLoaded: true,
      house_id: this.props.userData.data.house_ids[0],
      user_id: this.props.userData.id,
      house: data,
      neighborhood: addressHash.neighborhood,
      county: addressHash.county,
      no_users: data.no_users,
    }))
      .catch(error => console.log(error))
  }

  removeUserHouse(){
    let id = this.props.user_id
    let hId = this.props.house_id
    if(confirm("Are you sure you want to remove your house from your profile? Warning:: You can't undo this.")){
      this.props.removeUserHouse(id, hId)
      setTimeout(this.goToDashboard, 1000)
    }else{
      this.forceUpdateApp()
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
    if(confirm("Are you sure? This effects everyone in the house.")){
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
    }
  }

  // exclusively used for the no_resident buttons + and -
  updateHouseDetails(house = this.state.house){
      const path = `api/v1/houses`
      const houseData = {house: house}
      const id = this.props.house_id
      put(path, id, houseData)
        .then(data => this.setState({house: data, errors: "house details saved", errorStyle: {display: 'block'}}))
        .catch(error => this.setState({errors: 'house could not be saved'}))
  }

  // used for onBlur to put and save data
  updateUserHouseDetails(){
      if(confirm("Careful! Changing your move_in_date may affect your score and cannot be undone.")){
      const path = `api/v1/houses`
      const user_id = this.props.user_id
      const house = this.state.house
      const moveInDate = this.state.house.move_in_date
      const houseData = {user_house: {move_in_date: moveInDate}, house: house, user_id: user_id}
      const id = this.props.house_id
      put(path, id, houseData)
        .then(data => this.setState({house: data, errors: "house details saved", errorStyle: {display: 'block'}}))
        .catch(error => this.sortErrors(error))
      }else{
        this.forceUpdate()
      }

  }

  sortErrors(err){
    err.error === 'ignore date nil' ? console.log() : this.setState({errors: 'house could not be saved'})
  }

  disappear(){
    this.setState({errors: ""})
  }

  changePlaceholder(e){
    e.target.value = ''
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
    let { move_in_date } = this.state.house
    if(this.state.house_exists && addressLoaded){
      return(
        <div className="houseSettings-container">
          <div className="housesettings-editform-container">
            <div className="housesettings-error-box" onClick={this.disappear} style={this.state.errorStyle}>
              { this.state.errors }
            </div>
            <h1 className="edit-header house-settings">House Settings</h1>
            <h2 className="edit-header current-settings">Editable Details</h2>
            <form
              className="form-container house-editform"
              >

                <h5>Your Move in Date</h5>
                <label>
                  <input
                    id="move-in"
                    required="false"
                    type="date"
                    name="move_in_date"
                    placeholder={ move_in_date }
                    value={ move_in_date }
                    onFocus={(e) => {return e.target.value = ''}}
                    onChange={(e) => this.handleChange(e) }
                    onBlur={ this.updateUserHouseDetails }
                  />
                </label>

              </form>
            <h2 className="edit-header current-settings static-details">Static Details</h2>
            { addressLoaded ? this.addressForm() : null }
          </div>
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
    move_in_date: state.userInfo.move_in_date,
    userData: state.userInfo
  })
}

export default withRouter(connect(mapStateToProps, {removeUserHouse})(HouseSettings));
