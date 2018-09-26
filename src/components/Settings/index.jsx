import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { get, post } from '../../api_client';
  import DashLogo from './img/outline-assessment-24px.svg';
  import BillsLogo from './img/doc.svg';
  import ProfileLogo from './img/profile.svg';
  import HouseLogo from './img/household.svg';
  import InviteLogo from './img/invite.svg';
  import FeedbackLogo from './img/feedback.svg';
  import AboutLogo from './img/about.svg';
  import ContactLogo from './img/contact.svg';
  import LogoutLogo from './img/log_grey.svg';
  import './Settings-styles.css';

class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      avatar_url: "./fake_avatar_img.jpg",
      billsLogo: BillsLogo,
      dashLogo: DashLogo,
      profileLogo: ProfileLogo,
      houseLogo: HouseLogo,
      inviteLogo: InviteLogo,
      feedbackLogo: FeedbackLogo,
      aboutLogo: AboutLogo,
      contactLogo: ContactLogo,
      logoutLogo: LogoutLogo,
    };
    this.goToPage = this.goToPage.bind(this);
    this.goToContactPage = this.goToContactPage.bind(this);
    this.bugsPage = this.bugsPage.bind(this);
    this.logout = this.logout.bind(this);
  };

  componentDidMount() {

    const path = 'api/v1/users/' + this.props.user_id;
    get(path)
      .then(data => this.setState({email: data.email, first: data.first, last: data.last}))
      .catch(error => console.log(error))
  }

  goToPage(name){
    this.logPageChange(name)
    this.props.history.push(name)
  }

  goToBugsPage(event){
    this.logPageChange('/bugs')
    this.props.history.push('/bugs')
  }

  goToGoalsPage(event){
    console.log("not built yet")
  }

  goToContactPage(event){
    console.log('not built yet')
  }

  bugsPage(){
    this.logPageChange('/bugs')
    this.props.history.push('/bugs')
  }

  logout(event){
    event.preventDefault();
    let id = sessionStorage.getItem('user_id')
    let path = `${id}/user-logs-out`
    post(path)
      .then(data => console.log())
      .catch(error => console.log(error))
    localStorage.clear();
    this.props.history.push('/')
    setTimeout(this.resetPage, 500)
  }

  resetPage(){
    return location.reload()
  }

  logPageChange(path){
    let id = this.props.user_id
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
    let house = this.props.house;
    return (
    <div>
      { house ?
      <div className="shrunken-subnav-div">
        <ul className="shrunken-subnav-list">
          <li className="shrunken-nav-buttons">
            <div className="shrunken-nav-icon-container dash">
              <div className='shrunken-nav-label' onClick={(e) => this.goToPage('/dashboard')}>Dash</div>
              <img alt="carbon collective logo" className="navbar-link dash-log dropdown-logo" src={this.state.dashLogo} style={{width: '36px', height: '38px'}} onClick={(e) => this.goToDash(e)}/>
            </div>
          </li>
          <li className="shrunken-nav-buttons">
            <div className="shrunken-nav-icon-container bills">
              <div className='shrunken-nav-label' onClick={(e) => this.goToPage('/managebills')}>Bills</div>
              <img alt="carbon collective logo" className="navbar-link dropdown-logo" src={this.state.billsLogo} style={{width: '24px', height: '30px', paddingBottom: "2px"}} onClick={(e) => this.goToDash(e)}/>
            </div>
          </li>
          <li className="shrunken-nav-buttons">
            <div className="shrunken-nav-icon-container invites">
              <div className='shrunken-nav-label' onClick={(e) => this.goToPage('/invites')}>Invite</div>
              <img alt="invite logo" className="settings-logo dropdown-logo" src={this.state.inviteLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToPage('/invites')}/>
            </div>
          </li>
        </ul>
      </div> : null }
      <div className="settings-dropdown">
        <div className='settings-header' onClick={(e) => this.goToPage('/dashboard')}>
          <div className="settings-email">
            <p className="first">{this.state.first} {this.state.last}</p><br/>
            <p className="second">{this.state.email}</p>
          </div>
        </div>
        <div className="settings-page">
          <div className="settings-div">
            <ul className="options-list" onClick={(e) => this.goToPage('/user_settings')}>
              <li className="setting-icon">
                <img alt="profile logo" className="settings-logo first" src={this.state.profileLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToPage('/user_settings')}/>
              </li>
              <li className="setting-desc setting-desc-first first" >Profile</li>
            </ul>
            <ul className="options-list" onClick={(e) => this.goToPage('/house_settings')}>
              <li className="setting-icon">
                <img alt="house settings logo" className="settings-logo invite-logo" src={this.state.houseLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToPage('/house_settings')}/>
              </li>
              <li className="setting-desc">Household</li>
            </ul>
            <ul className="options-list" onClick={(e) => this.goToPage('/bugs')}>
              <li className="setting-icon">
                <img alt="feedback logo" className=" settings-logo invite-logo" src={this.state.feedbackLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToPage('/bugs')}/>
              </li>
              <li className="setting-desc">Feedback</li>
            </ul>
          </div>
          <div className="settings-div">
            <ul className="options-list" onClick={(e) => this.goToPage('/about')}>
              <li className="setting-icon">
                <img alt="about us logo" className="settings-logo invite-logo" src={this.state.aboutLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToPage('/about')}/>
              </li>
              <li className="setting-desc">About</li>
            </ul>
            <ul className="options-list" onClick={this.goToContactPage}>
              <li className="setting-icon">
                <img alt="contact us logo" className="settings-logo invite-logo" src={this.state.contactLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToContactPage(e)}/>
              </li>
              <li className="setting-desc">Contact</li>
            </ul>
          </div>
          <div className="settings-div">
            <ul className="options-list" onClick={this.logout}>
              <li className="setting-icon">
                <img alt="logout logo" className="settings-logo invite-logo" src={this.state.logoutLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.logout(e)}/>
              </li>
              <li className="setting-desc">Log Out</li>
            </ul>
          </div>
        </div>
      </div>
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

const mapStateToProps = (state) => ({
    user_id: state.userInfo.user_id
});
export default withRouter(connect(mapStateToProps, null)(Settings));
