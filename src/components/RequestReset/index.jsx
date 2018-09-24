import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { post } from '../../api_client';

import './ResetPassword-styles.css'

// this component is for a new-user who has been invited
class RequestReset extends Component {
  constructor() {
    super();
    this.state = {
      errors: "",
      email_confirmed: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignupForm = this.handleSignupForm.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.setSession = this.setSession.bind(this);
    this.disappear = this.disappear.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  componentDidMount(){

  }

  goToPage(path) {
    this.props.history.push(path)
  };

  setSession(data){
    alert("Your sign-up was successful. Now go check your email to confirm your registration!")
    this.goToPage('/confirm-address')
  }

  disappear(){
    this.setState({errors: ""})
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  handleSignupForm(event){
    event.preventDefault();
    const newUser = this.state;
    const newUserData = {user: newUser}
    const newUserPath=`reset_password_email`
    post(newUserPath, newUserData)
      .then(data => this.handleSuccess())
      .catch(
        error => this.handleErrors(error)
      )
  }

  handleSuccess(){
    alert("Password recovery email sent. Please check your inbox.")
    const path = '/'
    this.goToPage(path)
  }

  handleErrors(error){
    if(error.errors !== "Please confirm your email address to continue"){
      this.setState({errors: error.errors})
    }
  }

  render() {
    return (
      <div className="signup-page-div">
        <form
          className="form-container signup-form"
          onSubmit={ this.handleSignupForm }
        >
        <label>
        <h4 className="new-user-label"> Enter your Carbon Collective email address and we'll send you a new password invite! </h4>
        <input
          autoFocus
          required={true}
          name="email"
          type="text"
          onChange={this.handleChange}
        />
        </label>
        <div className="reset-error-box" onClick={this.disappear}>
          { this.state.errors }
        </div>
        <div className="button-containers signup-button-container">
          <button
            className="form-submit signup-btn-submit"
            type="submit"
            >Send me a Link!</button>
        </div>
        </form>
      </div>
    )
  };
};

export default withRouter(RequestReset);
