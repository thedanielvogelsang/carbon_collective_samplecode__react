import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import IconButton from 'material-ui/IconButton';
// import FontIcon from 'material-ui/FontIcon';
import {post} from '../../api_client';
import {connect} from 'react-redux'
import { loginUser, clearError } from '../../actions/userActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
  import LogGrey from "./img/log_grey.svg";
  import LogGreen from "./img/log_green.svg";
  import CCLogo from './img/CC_logo.svg';
  import DashFoot from './img/outline-assessment-24px.svg';
  import InviteLogo from './img/invite.svg';
  import BillsPageLogo from './img/doc.svg';
  import billsLogo from './img/doc.svg';

import "typeface-roboto";
import './Navbar-styles.css'
//
// function addColor() {
//   this.style.backgroundColor = 'rgb(121,194,120)'
// }

// function removeColor() {
//   this.style.backgroundColor = undefined
// }

class Navbar extends Component {
  constructor(props){
    super(props)
    this.state = {
      foot_url: "./img/FOOT_blank_2.png",
      login_input: "",
      logDiv: "login-div",
      log: LogGrey,
      logo: CCLogo,
      dashLogo: DashFoot,
      inviteLogo: InviteLogo,
      billsLogo: BillsPageLogo,
      placeholder: 'log in (email)',
      user_id: props.user_id || false,
      email: false,
      email_logged: false,
      password_logged: false,
      password: '',
      loaded: false,
      settingsOpen: false,
      forgotPassword: "passwordReset-div"
  };
    this.goBack = this.goBack.bind(this)
    this.goToDash = this.goToDash.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.goToAboutPage = this.goToAboutPage.bind(this)
    this.goToContactPage = this.goToContactPage.bind(this)
    this.goToInvitePage = this.goToInvitePage.bind(this)
    this.checkLoginStatus = this.checkLoginStatus.bind(this)
    this.checkSettingsStatus = this.checkSettingsStatus.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLoginForm = this.handleLoginForm.bind(this)
    this.highlightLogin = this.highlightLogin.bind(this)
    this.unhighlightLogin = this.unhighlightLogin.bind(this)
    this.goToResetPasswordPage = this.goToResetPasswordPage.bind(this)
    this.logLogin = this.logLogin.bind(this)
    this.goToPage = this.goToPage.bind(this)
    this.inputBox = this.inputBox.bind(this)
    this.clearAll = this.clearAll.bind(this)
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount(){
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.error){
      alert(this.props.error.errors)
      this.clearAll()
      this.props.clearError()
    }
    this.checkLoginStatus()
    this.checkSettingsStatus()
  }

  componentWillReceiveProps(nextProps){
  }

  clearAll(){
    this.setState({
      foot_url: "./img/FOOT_blank_2.png",
      login_input: "",
      logDiv: "login-div",
      log: LogGrey,
      placeholder: 'log in (email)',
      user_id: this.props.user_id || false,
      email: false,
      email_logged: false,
      password_logged: false,
      password: '',
      loaded: false,
      forgotPassword: "passwordReset-div"
    });
  }

  goToResetPasswordPage(){
    localStorage.clear();
    this.goToPage('/request-reset')
  }
  checkLoginStatus(){
    // check for state user_id here, if it exists then loaded = true
    if(this.props.id && !this.state.loaded){
      this.setState({
        loaded: true
      })
    }
  }

  checkSettingsStatus(){
    let status = this.state.settingsOpen
    // initializes with false
    // if found to be false and on settings page, make opposite
    if(this.props.history.location.pathname === '/settings' && !status){this.setState({settingsOpen: !status})}
    if(this.props.history.location.pathname !== '/settings' && status){this.setState({settingsOpen: !status})}
  }

  handleChange(e){
    let value = e.target.value;
    let name = e.target.name
    this.setState({
      [name]: value,
    })
  }

  handleLogin(){
    const stateData = { ...this.state };
    const loginData = {user: stateData}
    this.props.loginUser(loginData)
    setTimeout(this.logLogin, 2000)
  }

  resetWithErrors(error){
    alert(error.errors)
    this.clearAll()
  }

  goToPage(path) {
    this.props.history.push(path)
  };


  logLogin(){
    if(this.props.id && this.props.data && this.props.data.privacy_policy){
      let path = `${this.props.id }/user-logs-in`
      post(path)
        .then(ans => this.goToPage('/dashboard'))
        .catch(error => console.log(error))
    }else if(!Array.isArray(this.props.data) && !this.props.data.privacy_policy){
      let path = `${this.props.id }/user-logs-in`
      post(path)
        .then(ans => this.goToPage('/privacy-policy'))
        .catch(error => console.log(error))
    }
    this.clearAll()
  }

  handleLoginForm(e){
    e.preventDefault();
    if(this.state.email && this.state.password === '' && !this.state.loaded){
      this.setState({
        email_logged: true,
        placeholder: 'password'
      })
    }else if(this.state.password !== '' && !this.state.loaded){
      this.setState({
        password_logged: true,
      }, this.handleLogin)
    }else{
      console.log('other login response needed')
    }
  }

  highlightLogin(e){
    e.target.value = ''
    this.setState({
      log: LogGreen,
      logDiv: 'login-div highlighted',
    })
  }

  unhighlightLogin(){
    if(this.state.email_logged){
      this.setState({
        log: LogGrey,
        logDiv: 'login-div',
        placeholder: 'password'
      })
    }else{
      this.setState({
        log: LogGrey,
        logDiv: 'login-div',
        placeholder: 'log in (email)'
      })
    }
  }

  inputBox(){
    if(!this.state.email_logged){
      return(
        <input
          className="login-bar"
          name="email"
          onChange={this.handleChange}
          onFocus={this.highlightLogin}
          onBlur={this.unhighlightLogin}
          placeholder={this.state.placeholder}
          onKeyPress={function(){return null}}
        />
      )
    }else if(!this.state.password_logged){
      return(
        <input
          type="password"
          className="login-bar"
          name="password"
          onChange={this.handleChange}
          onFocus={(e) => this.highlightLogin(e)}
          onBlur={this.unhighlightLogin}
          placeholder={this.state.placeholder}
          value={this.state.password}
        />
      )
    }else{
      return(
        <div>
        </div>
      )
    }

  }

  render() {
    let loaded = this.state.loaded;
    let house = this.props.house;
    if (['/'].indexOf(window.location.pathname) > -1 && !loaded) {
      return(
        <div className="landing-navbar navbar unloaded">
          <img alt="carbon collective logo homepage" className="cc-logo homepage unloaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
          <div className="navbar-logo-menu-div unloaded shrunken">
            <form className="shrunken-landing-navbar-login-form unloaded" style={{display: 'none'}} onSubmit={(e) => this.handleLoginForm(e)}>
              <div className={this.state.logDiv}>
                <img alt="log logo" className="log-svg" src={this.state.log} style={{ width: '26px' }} />
                {this.inputBox()}
              </div>
            </form>
          </div>
          <form className="landing-navbar-login-form unloaded" onSubmit={(e) => this.handleLoginForm(e)}>
            <div className={this.state.logDiv}>
              <img alt="log logo" className="log-svg" src={this.state.log} style={{ width: '26px' }} />
              {this.inputBox()}
            </div>
          </form>
          <div className={this.state.forgotPassword}>
            <h6 className="passwordReset">forgot your <span className="password-reset-link" onClick={(e) => this.goToResetPasswordPage()}>password</span>?</h6>
          </div>
          <div className="landing-navbar-links">
            <ul className="navbar">
              <li className="header-button landing-nav-link unloaded">
                <a onClick={(e) => this.goToAboutPage(e)}>About</a>
              </li>
              <li className="header-button landing-nav-link contactUs unloaded">
                <a onClick={(e) => this.goToContactPage(e)}>Contact</a>
              </li>
            </ul>
          </div>
        </div>
      )
    }
    else if(!loaded){
        return(
          <div className="main-navbar navbar">
            <div className="navbar-logo-menu-div navbar loaded">
              <img alt="carbon collective logo homepage" className="cc-logo not-homepage unloaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
            </div>
          </div>
          )
    }
    else if(['/'].indexOf(window.location.pathname) > -1 && loaded && !house) {
      return(
        <div className="main-navbar">
          <div className="navbar-logo-menu-div navbar loaded">
            <img alt="carbon collective logo homepage" className="cc-logo homepage loaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
            <FontAwesomeIcon icon={faEllipsisH} className="shrunken-hamburger-menu" onClick={this.goToSettings}/>
          </div>
          <div className="landing-navbar-links">
            <ul className="navbar">
              <li className="header-button landing-nav-link spacer">
                <a onClick={(e) => this.goToAboutPage(e)}>About</a>
              </li>
              <li className="header-button landing-nav-link spacer">
                <a onClick={(e) => this.goToContactPage(e)}>Contact</a>
              </li>
              <li className="header-button landing-nav-link">
                <img alt="carbon collective logo" className="navbar-link dash-logo landing" src={this.state.dashLogo} style={{width: '36px', height: '38px'}} onClick={(e) => this.goToDash(e)}/>
              </li>
              <li className="header-button landing-nav-link hamburger spacer">
                <FontAwesomeIcon icon={faEllipsisH} className="hamburger-menu-landing" onClick={this.goToSettings}/>
              </li>
            </ul>
          </div>
        </div>
      )
    }
    else if(['/'].indexOf(window.location.pathname) > -1 && loaded && house) {
      return(
        <div className="main-navbar">
          <div className="navbar-logo-menu-div navbar loaded">
            <img alt="carbon collective logo homepage" className="cc-logo homepage loaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
            <FontAwesomeIcon icon={faEllipsisH} className="shrunken-hamburger-menu" onClick={this.goToSettings}/>
          </div>
          <div className="landing-navbar-links">
            <ul className="navbar">
              <li className="header-button landing-nav-link spacer">
                <a onClick={(e) => this.goToAboutPage(e)}>About</a>
              </li>
              <li className="header-button landing-nav-link spacer">
                <a onClick={(e) => this.goToContactPage(e)}>Contact</a>
              </li>
              <li className="header-button landing-nav-link">
                <img alt="carbon collective logo" className="navbar-link dash-logo landing" src={this.state.dashLogo} style={{width: '36px', height: '38px'}} onClick={(e) => this.goToDash(e)}/>
              </li>
              <li className="header-button landing-nav-link hamburger spacer">
                <FontAwesomeIcon icon={faEllipsisH} className="hamburger-menu-landing" onClick={this.goToSettings}/>
              </li>
            </ul>
          </div>
        </div>
      )
    }
    else if(['/settings'].indexOf(window.location.pathname) > - 1){
      let house = this.props.house
      let ct = this.props.data.bills_left
      let inv = this.props.data.invites_left
      return(
        <div className="main-navbar">
          <div className="navbar-logo-menu-div navbar loaded">
            <img alt="carbon collective logo homepage" className="cc-logo not-homepage loaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
            <FontAwesomeIcon icon={faEllipsisH} className="shrunken-hamburger-menu" onClick={this.goToSettings}/>
          </div>
          <div className="landing-navbar-links">
            <ul className="navbar">
              <li className="header-button landing-nav-link">
                <img alt="carbon collective logo" className="navbar-link dash-logo" src={this.state.dashLogo} style={{width: '36px', height: '38px'}} onClick={(e) => this.goToDash(e)}/>
              </li>
              { house ?
              <span>
              <li className="header-button landing-nav-link">
                <img alt="carbon collective logo" className="navbar-link dash-logo landing" src={billsLogo} style={{width: '24px', height: '32px'}} onClick={(e) => this.goToPage('/managebills')}/>
                {ct ? <div className="notifier-dot billspage">{ct}</div> : null }
              </li>
              <li className="header-button landing-nav-link spacer">
                <img alt="carbon collective logo" className="navbar-link invite-logo" src={this.state.inviteLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToInvitePage(e)}/>
                {inv ? <div className="notifier-dot billspage">{inv}</div> : null }
              </li></span>: null }
              <li className="header-button landing-nav-link spacer">
                <FontAwesomeIcon icon={faEllipsisH} className="navbar-link hamburger-menu" onClick={(e) => this.goToSettings()}/>
              </li>
            </ul>
          </div>
        </div>
      )
    }
    else if(['/login', '/signup'].indexOf(window.location.pathname) > -1){
        return(
          <div className="main-navbar navbar">
            <div className="navbar-logo-menu-div navbar loaded">
              <img alt="carbon collective logo homepage" className="cc-logo not-homepage unloaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
            </div>
          </div>
          )
    }
    else if(house){
      let ct = this.props.data.bills_left
      let inv = this.props.data.invites_left
        return (
          <div className="main-navbar">
            <div className="navbar-logo-menu-div navbar loaded">
              <img alt="carbon collective logo homepage" className="cc-logo not-homepage loaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
              <img alt="carbon collective logo dropdown" className="cc-logo dropdown-logo" src={this.state.logo} style={{width: '26px'}} onClick={this.goToSettings}/>
            </div>
            <div className="landing-navbar-links">
              <ul className="navbar">
                <li className="header-button landing-nav-link">
                  <img alt="carbon collective logo" className="navbar-link dash-logo" src={this.state.dashLogo} style={{width: '36px', height: '38px'}} onClick={(e) => this.goToDash(e)}/>
                </li>
                <li className="header-button landing-nav-link bills">
                  <img alt="carbon collective logo" className="navbar-link dash-logo landing" src={billsLogo} style={{width: '24px', height: '32px'}} onClick={(e) => this.goToPage('/managebills')}/>
                  {ct ? <div className="notifier-dot billspage">{ct}</div> : null }
                </li>
                <li className="header-button landing-nav-link spacer">
                  <img alt="carbon collective logo" className="navbar-link invite-logo" src={this.state.inviteLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToInvitePage(e)}/>
                  {inv ? <div className="notifier-dot billspage">{inv}</div> : null }
                </li>
                <li className="header-button landing-nav-link spacer">
                  <FontAwesomeIcon icon={faEllipsisH} className="navbar-link hamburger-menu" onClick={(e) => this.goToSettings()}/>
                </li>
              </ul>
            </div>
          </div>
        )
      }
      else{
        return (
          <div className="main-navbar">
            <div className="navbar-logo-menu-div navbar loaded">
              <img alt="carbon collective logo homepage" className="cc-logo not-homepage loaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
              <img alt="carbon collective logo dropdown" className="cc-logo dropdown-logo" src={this.state.logo} style={{width: '26px'}} onClick={this.goToSettings}/>
            </div>
            <div className="landing-navbar-links">
              <ul className="navbar">
                <li className="header-button landing-nav-link">
                  <img alt="carbon collective logo" className="navbar-link dash-logo" src={this.state.dashLogo} style={{width: '36px', height: '38px'}} onClick={(e) => this.goToDash(e)}/>
                </li>
                <li className="header-button landing-nav-link spacer">
                  <FontAwesomeIcon icon={faEllipsisH} className="navbar-link hamburger-menu" onClick={(e) => this.goToSettings()}/>
                </li>
              </ul>
            </div>
          </div>
        )
      }
  }

  goBack(){
    this.setState({settingsOpen: false})
    this.logPageChange("/back")
    this.context.router.history.goBack()
  }

  goToDash(){
    this.setState({settingsOpen: false})
    this.logPageChange("/dashboard")
    this.props.history.push('/dashboard')
  }

  goToSettings(){
    this.checkSettingsStatus()
    if(this.state.settingsOpen){
      this.context.router.history.goBack()
      this.setState({settingsOpen: false})
      this.logPageChange("/settings-close")
    }else{
      this.setState({settingsOpen: true})
      this.logPageChange("/settings")
      this.props.history.push('/settings')
    }
  }

  goToAboutPage(){
    this.setState({settingsOpen: false})
    this.logPageChange("/about")
    this.props.history.push('/about')
  }
  goToContactPage(){
    this.setState({settingsOpen: false})
    this.logPageChange("/contact")
    this.props.history.push('/contact')
  }

  goToInvitePage(){
    this.setState({settingsOpen: false})
    this.logPageChange("/invites")
    this.props.history.push('/invites')
  }

  logPageChange(name){
    let id = this.props.id
    let path = `${id}/presses-nav-btn`
    let page = this.props.history.location.pathname
    let datum = {user_behavior: {
        buttonName: name,
        pageName: page,
       }
     }
    post(path, datum)
     .then(data => console.log())
     .catch(error => console.log(error))
  }
}

const mapStateToProps = (state) => ({
    id: state.userInfo.user_id,
    data: state.userInfo.data,
    error: state.userInfo.error,
});
//
// else if(['/search_address', '/add_neighborhood', '/add_county'].indexOf(window.location.pathname) > -1){
//   return(
//     <div className="main-navbar navbar">
//       <div className="navbar-logo-menu-div navbar loaded">
//         <img alt="carbon collective logo homepage" className="cc-logo not-homepage loaded" src={this.state.logo} style={{width: '26px'}} onClick={(e) => this.goToPage('/')}/>
//         <img alt="carbon collective logo dropdown" className="cc-logo dropdown-logo" src={this.state.logo} style={{width: '26px'}} onClick={this.goToSettings}/>
//       </div>
//       <div className="landing-navbar-links">
//         <ul className="navbar">
//           <li className="header-button landing-nav-link">
//             <FontAwesomeIcon icon={faEllipsisH} className="navbar-link hamburger-menu" onClick={(e) => this.goToSettings()}/>
//           </li>
//         </ul>
//       </div>
//     </div>
//   )
// }

// const mapDispatchToProps = (dispatch) => ({
//
// });

//     <li className="header-button landing-nav-link">
    //   <img alt="carbon collective logo" className="navbar-link bills-page-logo" src={this.state.billsLogo} style={{width: '26px', height: '32px'}} onClick={(e) => this.goToPage('/managebills')}/>
    // </li>

// bypassing mapDispatchToProps for now:
export default withRouter(connect(mapStateToProps, { loginUser, clearError })(Navbar));
