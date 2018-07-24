import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { post } from '../../api_client';
import './FirstLogin-styles.css';

class FirstLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: "",
      arrow: {display: 'block', bottom: '352px'},
    };
    this.handleLoginForm = this.handleLoginForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.disappear = this.disappear.bind(this);
    this.changeHelperArrow = this.changeHelperArrow.bind(this);
  }

  disappear(){
    this.setState({errors: ""})
  }

  goToPage(path) {
    this.props.history.push(path)
  };

  changeHelperArrow(){
    this.setState({
      arrow:{
        display: 'block', bottom: '230px'
      }
    })
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  setSession(data){
    sessionStorage.setItem('user_id', data.id)
    this.props.updateState('user_id', data.id)
    setTimeout(this.goToPage, 500, '/privacy-policy')
    // alert("Welcome to CarbonCollective! Central to calculating your environmental impact is knowing the average per capita use of your geographic location. Lets start off by letting us know where you live:")
    // setTimeout(this.goToPage, 500, '/search_address')
  }

  handleLoginForm(event) {
    event.preventDefault();
    const stateData = { ...this.state };
    const loginData = {user: stateData}
    const sessionsPath = `login`
    post(sessionsPath, loginData)
      .then(
        data => this.setSession(data)
      )
      .catch(
        error => this.setState({errors: error.errors})
      )

  }

  render() {
    return (

        <div className="login-signup-page">
          <h1 className="welcome-words"> Welcome to Carbon Collective! Let's start by logging in.</h1>
            <form
              className="form-container login-form"
              onSubmit={ this.handleLoginForm }
            >
            <div className="login-form">
            <label>
              <h4 className="login-email-label"> Email Address </h4>
              <input
                className="signin-input"
                name="email"
                type="text"
                required={true}
                inputMode="text"
                onChange={ this.handleChange }
                onFocus={this.changeHelperArrow}
                />
            </label>
            <label>
              <h3 className="login-email-label">Password </h3>
              <input
              className="signin-input"
              name="password"
              required={true}
              type="password"
              inputMode="text"
              onChange={this.handleChange}
              />
            </label>
            </div>
              <div className="login-error-box" onClick={this.disappear}>
                { this.state.errors }
              </div>
              <div className="button-containers login-button-container">
                <button
                  className="login-button"
                  name="first-login-btn"
                  type="submit"
                  >Login</button>
              </div>
            </form>
          </div>
    )
  };
};

export default withRouter(FirstLogin);
