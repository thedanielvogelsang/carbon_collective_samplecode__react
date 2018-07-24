import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import { get, post } from '../../api_client'
import './Settings-styles.css';

const iconStyles = {
  color: 'black',
  height: 58,
  width: 58,
  fontSize: 36,
}

const iconStylesFirst = {
  color: 'rgb(43, 152, 240)',
  height: 58,
  width: 64,
  fontSize: 36,
}

class Settings extends Component {
  constructor(){
    super();
    const user_id = sessionStorage.getItem('user_id')
    this.state = {
      user_id: user_id,
      email: '',
      avatar_url: "./fake_avatar_img.jpg",
    };
    this.goToInvitePage = this.goToInvitePage.bind(this);
    this.goToUserUpdatePage = this.goToUserUpdatePage.bind(this);
    this.goToHouseUpdatePage = this.goToHouseUpdatePage.bind(this);
    this.suggestionsPage = this.suggestionsPage.bind(this);
    this.bugsPage = this.bugsPage.bind(this);
    this.logout = this.logout.bind(this);
  };

  componentDidMount() {
    const path = 'api/v1/users/' + this.state.user_id;
    get(path)
      .then(data => this.setState({email: data.email, first: data.first, last: data.last}))
      .catch(error => console.log(error))
  }

  goToInvitePage(event){
    this.logPageChange('/invites')
    this.props.history.push('/invites')
  }

  goToGoalsPage(event){
    console.log("not built yet")
  }

  goToUserUpdatePage(event){
    this.logPageChange('/user_settings')
    this.props.history.push('/user_settings')
  }

  goToHouseUpdatePage(event){
    this.logPageChange('/house_settings')
    this.props.history.push('/house_settings')
  }

  logout(event){
    event.preventDefault();
    let id = sessionStorage.getItem('user_id')
    let path = `${id}/user-logs-out`
    post(path)
      .then(data => console.log())
      .catch(error => console.log(error))
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('house_id')
    localStorage.removeItem('resource_type')
    localStorage.removeItem('accent_color')
    this.props.history.push('/')
  }

  suggestionsPage(){
    this.logPageChange('/suggestions')
    this.props.history.push('/suggestions')
  }

  bugsPage(){
    this.logPageChange('/bugs')
    this.props.history.push('/bugs')
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

  render() {
    return (
    <div>
      <div className='settings-header' onClick={() => this.props.history.push('/dashboard')}>
        <div className="settings-email">
          <p className="first">{this.state.first} {this.state.last}</p><br/>
          <p className="second">{this.state.email}</p>
        </div>
      </div>
      <MuiThemeProvider>
        <div className="settings-page">
          <ul className="options-list" onClick={this.goToUserUpdatePage}>
            <li className="setting-icon">
              <FontIcon className="material-icons" style={iconStylesFirst}>contact_mail</FontIcon>
            </li>
            <li className="setting-desc setting-desc-first" >Edit Profile</li>
          </ul>
          <ul className="options-list" onClick={this.goToHouseUpdatePage}>
            <li className="setting-icon">
              <FontIcon className="material-icons" style={iconStyles}>build</FontIcon>
            </li>
            <li className="setting-desc">Update Household</li>
          </ul>
          <ul className="options-list" onClick={this.goToInvitePage}>
            <li className="setting-icon">
              <FontIcon className="material-icons" style={iconStyles}>accessibility</FontIcon>
            </li>
            <li className="setting-desc">Invite Someone</li>
          </ul>
          <ul className="options-list" onClick={this.suggestionsPage}>
            <li className="setting-icon">
              <FontIcon className="material-icons" style={iconStyles}>live_help</FontIcon>
            </li>
            <li className="setting-desc">Send a Suggestion</li>
          </ul>
          <ul className="options-list" onClick={this.bugsPage}>
            <li className="setting-icon">
              <FontIcon className="material-icons" style={iconStyles}>bug_report</FontIcon>
            </li>
            <li className="setting-desc">Bug Fix Request</li>
          </ul>
          <ul className="options-list" onClick={this.logout}>
            <li className="setting-icon">
              <FontIcon className="material-icons" style={iconStyles}>hourglass_empty</FontIcon>
            </li>
            <li className="setting-desc">Log Out</li>
          </ul>
        </div>
      </MuiThemeProvider>
    </div>
    )
  };
};

// <div className="avatar-container">
//   <img
//     className="avatar-img"
//     alt="carbon collective logo"
//     src={require(`${this.state.avatar_url}`)} />
// </div>

// <ul className="options-list" onClick={this.goToGoalPage}>
//   <li className="setting-icon">
//     <FontIcon className="material-icons" style={iconStyles}>g_translate</FontIcon>
//   </li>
//   <li className="setting-desc">Set Goals</li>
// </ul>

export default withRouter(Settings);
