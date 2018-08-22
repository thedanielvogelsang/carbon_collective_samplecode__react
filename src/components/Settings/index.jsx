import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import { get, post } from '../../api_client'
  import DashLogo from './img/footprint.svg';
  import BillsLogo from './img/doc.svg';
  import ProfileLogo from './img/profile.svg';
  import HouseLogo from './img/household.svg';
  import InviteLogo from './img/invite.svg';
  import FeedbackLogo from './img/feedback.svg';
  import AboutLogo from './img/about.svg';
  import ContactLogo from './img/contact.svg';
  import LogoutLogo from './img/log_grey.svg';
  import './Settings-styles.css';

const iconStyles = {
  color: 'black',
  height: 58,
  width: 58,
  fontSize: 36,
}

const iconStylesFirst = {
  color: 'rgb(47, 157, 102)',
  height: 58,
  width: 64,
  fontSize: 36,
}

class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      avatar_url: "./fake_avatar_img.jpg",
      dashLogo: DashLogo,
      billsLogo: BillsLogo,
      profileLogo: ProfileLogo,
      houseLogo: HouseLogo,
      inviteLogo: InviteLogo,
      feedbackLogo: FeedbackLogo,
      aboutLogo: AboutLogo,
      contactLogo: ContactLogo,
      logoutLogo: LogoutLogo,
    };
    this.goToDash = this.goToDash.bind(this);
    this.goToInvitePage = this.goToInvitePage.bind(this);
    this.goToUserUpdatePage = this.goToUserUpdatePage.bind(this);
    this.goToHouseUpdatePage = this.goToHouseUpdatePage.bind(this);
    this.suggestionsPage = this.suggestionsPage.bind(this);
    this.goToAboutPage = this.goToAboutPage.bind(this);
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

  goToDash(event){
    this.logPageChange('/dashboard')
    this.props.history.push('/dashboard')
  }

  goToInvitePage(event){
    this.logPageChange('/invites')
    this.props.history.push('/invites')
  }

  goToUserUpdatePage(event){
    this.logPageChange('/user_settings')
    this.props.history.push('/user_settings')
  }

  goToHouseUpdatePage(event){
    this.logPageChange('/house_settings')
    this.props.history.push('/house_settings')
  }

  goToBugsPage(event){
    this.logPageChange('/bugs')
    this.props.history.push('/bugs')
  }
  goToAboutPage(event){
    this.logPageChange('/about')
    this.props.history.push('/about')
  }

  goToGoalsPage(event){
    console.log("not built yet")
  }

  goToContactPage(event){
    console.log('not built yet')
  }

  suggestionsPage(){
    this.logPageChange('/suggestions')
    this.props.history.push('/suggestions')
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
    return (
    <div>
    <div className="shrunken-subnav-div">
      <ul className="shrunken-subnav-list">
        <li className="shrunken-nav-buttons">
          <div className="shrunken-nav-icon-container dash">
            <div className='shrunken-nav-label'>Dash</div>
            <img alt="carbon collective logo" className="navbar-link dash-log dropdown-logo" src={this.state.dashLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToDash(e)}/>
          </div>
        </li>
        <li className="shrunken-nav-buttons">
          <div className="shrunken-nav-icon-container bills">
            <div className='shrunken-nav-label'>Bills</div>
            <img alt="carbon collective logo" className="navbar-link bills-page-logo dropdown-logo" src={this.state.billsLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToPage('/managebills')}/>
          </div>
        </li>
      </ul>
    </div>
    <div className="settings-dropdown">
      <div className='settings-header' onClick={() => this.props.history.push('/dashboard')}>
        <div className="settings-email">
          <p className="first">{this.state.first} {this.state.last}</p><br/>
          <p className="second">{this.state.email}</p>
        </div>
      </div>
      <div className="settings-page">
        <div className="settings-div">
          <ul className="options-list" onClick={this.goToUserUpdatePage}>
            <li className="setting-icon">
              <img alt="profile logo" className="settings-logo first" src={this.state.profileLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToUserUpdatePage(e)}/>
            </li>
            <li className="setting-desc setting-desc-first first" >Profile</li>
          </ul>
          <ul className="options-list" onClick={this.goToHouseUpdatePage}>
            <li className="setting-icon">
              <img alt="house settings logo" className="settings-logo invite-logo" src={this.state.houseLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToHouseUpdatePage(e)}/>
            </li>
            <li className="setting-desc">Household</li>
          </ul>
          <ul className="options-list" onClick={this.goToInvitePage}>
            <li className="setting-icon">
              <img alt="invite logo" className="settings-logo invite-logo" src={this.state.inviteLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToInvitePage(e)}/>
            </li>
            <li className="setting-desc">Invite</li>
          </ul>
          <ul className="options-list" onClick={this.suggestionsPage}>
            <li className="setting-icon">
              <img alt="feedback logo" className=" settings-logo invite-logo" src={this.state.feedbackLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.suggestionsPage(e)}/>
            </li>
            <li className="setting-desc">Feedback</li>
          </ul>
        </div>
        <div className="settings-div">
          <ul className="options-list" onClick={this.goToAboutPage}>
            <li className="setting-icon">
              <img alt="about us logo" className="settings-logo invite-logo" src={this.state.aboutLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToAboutPage(e)}/>
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
        <ul className="options-list" onClick={this.logout}>
          <li className="setting-icon">
            <img alt="logout logo" className="settings-logo invite-logo" src={this.state.logoutLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.logout(e)}/>
          </li>
          <li className="setting-desc">Log Out</li>
        </ul>
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
