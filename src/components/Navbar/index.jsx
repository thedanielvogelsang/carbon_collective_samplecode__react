import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import BackArrow from 'material-ui/svg-icons/av/replay';
import {post} from '../../api_client';
import {connect} from 'react-redux'
import { loginUser } from '../../actions/userActions'
  import LogGrey from "./img/log_grey.svg";
  import LogGreen from "./img/log_green.svg";

import "typeface-roboto";
import './Navbar-styles.css'

function addColor() {
  this.style.backgroundColor = 'rgb(121,194,120)'
}

function removeColor() {
  this.style.backgroundColor = undefined
}

class Navbar extends Component {
    constructor(props){
      super(props)
      this.state = {
        foot_url: "./img/FOOT_blank_2.png",
        login_input: "",
        logDiv: "login-div",
        log: LogGrey,
        placeholder: 'log in',
        user_id: props.user_id || false,
        email: false,
        email_logged: false,
        password_logged: false,
        password: '',
        loaded: false,
        styles: {
          mediumIcon: {
            color: 'rgb(240, 250, 250)',
            opacity: 0.8,
            width: 36,
            height: 36,
            alignContent: 'center',
            justifyContent: 'center',
            paddingBottom: '10px',
          },
          mediumIcon4: {
            color: 'rgb(240, 250, 250)',
            opacity: 0.8,
            width: 36,
            height: 36,
            alignContent: 'center',
            justifyContent: 'center',
            paddingBottom: '10px',
          },
          left: {
            width: 48,
            height: 38,
            padding: 12,
            position: 'relative',
            top: 5,
          },
          middle: {
            width: 48,
            height: 38,
            padding: 12,
            position: 'relative',
            top: 5,
          },
          right: {
            width: 48,
            height: 38,
            padding: 12,
            position: 'relative',
            top: 5,
            verticalAlign: 'center'
          },
          color: {
            color: "#bdbec0"
          }
      },
        settingsOpen: false,
    };
      this.goBack = this.goBack.bind(this)
      this.goToDash = this.goToDash.bind(this)
      this.goToSettings = this.goToSettings.bind(this)
      this.goToInvitePage = this.goToInvitePage.bind(this)
      this.checkSettingsStatus = this.checkSettingsStatus.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleLogin = this.handleLogin.bind(this)
      this.handleLoginForm = this.handleLoginForm.bind(this)
      this.highlightLogin = this.highlightLogin.bind(this)
      this.unhighlightLogin = this.unhighlightLogin.bind(this)
      this.sortPageChange = this.sortPageChange.bind(this)
      this.goToPage = this.goToPage.bind(this)
      this.inputBox = this.inputBox.bind(this)
      this.clearAll = this.clearAll.bind(this)
    }

    static contextTypes = {
      router: PropTypes.object
    }

    componentDidMount(){
      this.checkLoginStatus()
      this.checkSettingsStatus()
    }

    componentDidUpdate(){

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
        placeholder: 'log in',
        user_id: this.props.user_id || false,
        email: false,
        email_logged: false,
        password_logged: false,
        password: '',
        loaded: false,
      });
    }

    checkLoginStatus(){
      // check for state user_id here, if it exists then loaded = true
      if(2 < 1){
        this.state({
          loaded: true
        })
      }
    }

    checkSettingsStatus(){
      let status = this.state.settingsOpen
      if(this.props.history.location.pathname !== '/settings' && status){this.setState({settingsOpen: false})}
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
      setTimeout(this.sortPageChange, 1000)
    }

    resetWithErrors(error){
      alert(error.errors)
      this.clearAll()
    }

    goToPage(path) {
      this.props.history.push(path)
    };

    sortPageChange(){
      let path = `${this.props.id}/user-logs-in`
      // if successful, add to redux
      post(path)
        .then(ans => console.log())
        .catch(error => console.log(error))
      if(!this.props.data.privacy_policy){
        this.clearAll()
        setTimeout(this.goToPage, 600, '/privacy-policy')
      }else{
        console.log("go to dash with or without a house")
        this.clearAll()
        setTimeout(this.goToPage, 1000, '/dashboard')
      }
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
        })
        this.handleLogin()
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
      if(this.state.email){
        this.setState({
          log: LogGrey,
          logDiv: 'login-div',
          placeholder: 'password'
        })
      }else{
        this.setState({
          log: LogGrey,
          logDiv: 'login-div',
          placeholder: 'log in'
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
    let loaded = this.props.loaded;
    if (['/'].indexOf(window.location.pathname) > -1 && !loaded) {
      return(
        <div className="landing-navbar">
          <div className="navbar-logo-menu-div">
            <h1 className="h1-c">C</h1>
          </div>
          <form className="landing-navbar-signup-form" onSubmit={(e) => this.handleLoginForm(e)}>
            <div className={this.state.logDiv}>
              <img alt="log logo" className="log-svg" src={this.state.log} style={{ width: '26px' }} />
              {this.inputBox()}
            </div>
          </form>
          <div className="landing-navbar-links">
            <ul className="navbar">
              <li className="header-button landing-nav-link">
                <a onClick={(e) => this.goToAboutPage(e)}>About</a>
              </li>
              <li className="header-button landing-nav-link">
                <a onClick={(e) => this.goToAboutPage(e)}>Contact</a>
              </li>
            </ul>
          </div>
        </div>
      )
    }else if(['/search_address', '/add_neighborhood', '/add_county'].indexOf(window.location.pathname) > -1){
      return(
        <div>
        </div>
      )
    }else if(['/login', '/signup', '/add_address', '/add_household', '/login-first-time', '/expand-request'].indexOf(window.location.pathname) > -1){
      return(
        <MuiThemeProvider>
          <header>
            <div className="header-navbar">
              <ul className="navbar">
                <li className="header-button">
                <IconButton onMouseEnter={addColor} onMouseLeave={removeColor} onClick={this.context.router.history.goBack} iconStyle={this.state.styles.mediumIcon} style={this.state.styles.left}>
                  <BackArrow className="svg-icon" />
                </IconButton>
                </li>
              </ul>
            </div>
          </header>
        </MuiThemeProvider>
      )
    }else{
      let color3 = this.state.styles.color.color
      let color = {color: color3}
      return (
        <MuiThemeProvider>
        <header>
          <div className="header-navbar">
            <ul className="navbar">
              <li className="header-button">
              <IconButton id="back-nav" onClick={this.goBack} iconStyle={this.state.styles.mediumIcon} style={this.state.styles.left}>
                <BackArrow  id="back-nav" className="svg-icon"/>
              </IconButton>
              </li>
              <li className="carbon-header">
              <button
                className="carbon-header-button"
                onClick={this.goToDash}
                id="carbon-nav"
                ><img
                    className="carbon-img-header"
                    alt="carbon collective dash button"
                    id="carbon-nav"
                    src={require(`${this.state.foot_url}`)}
                    style={{width: '18px', height: '30px'}}
                    />
              </button>
              </li>
              <li className="invite-button">
                <FontIcon className="material-icons plus_one" id="invite-nav" onClick={this.goToInvitePage} style={color}>plus_one</FontIcon>
                <FontIcon className="material-icons" id="invite-nav2" onClick={this.goToInvitePage} style={color}>accessibility</FontIcon>
              </li>
              <li id="settings-nav" className="header-button">
              <IconButton id="settings-nav" onClick={this.goToSettings} iconStyle={this.state.styles.mediumIcon4} style={this.state.styles.right}>
                <SettingsIcon id="settings-nav" className="svg-icon" />
              </IconButton>
              </li>
            </ul>
          </div>
        </header>
      </MuiThemeProvider>
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
    console.log('setings button pushed')
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
    data: state.userInfo.data
});

// const mapDispatchToProps = (dispatch) => ({
//
// });

// bypassing mapDispatchToProps for now:
export default withRouter(connect(mapStateToProps, { loginUser })(Navbar));
