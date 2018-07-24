import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { post } from '../../api_client';

import './NewUser-styles.css'

class NewUser extends Component {
  constructor() {
    super();
    this.state = {
      errors: "",
      first: "",
      last: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignupForm = this.handleSignupForm.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.setSession = this.setSession.bind(this);
    this.disappear = this.disappear.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
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
    const newUserPath=`users`
    post(newUserPath, newUserData)
      .then(data => this.goToPage('/confirm-address'))
      .catch(
        error => this.handleErrors(error)
      )
  }

  handleErrors(error){
    console.log(error.errors)
    if(error.errors !== "Please confirm your email address to continue"){
      this.setState({errors: error.errors})
    }else{
      this.props.history.push('/confirm-address')
      alert("Please confirm your email address to continue!")
    }
  }

  render() {
    return (
      <div>
        <form
          className="form-container signup-form"
          onSubmit={ this.handleSignupForm }
        >
        <h3> New User Signup </h3>
        <label>
        <h4> First Name </h4>
        <input
          autoFocus
          required={true}
          name="first"
          type="text"
          onChange={this.handleChange}
        />
        </label>
        <label>
        <h4> Last Name </h4>
        <input
          required={true}
          name="last"
          type="text"
          onChange={this.handleChange}
        />
        </label>
        <label>
        <h4> Email Address </h4>
        <input
          required={true}
          name="email"
          type="text"
          onChange={this.handleChange}
        />
        </label>
        <label>
        <h4> Password </h4>
        <input
          name="password"
          required={true}
          type="password"
          onChange={this.handleChange}
         />
        </label>
        <label>
        <h4> Confirm Password </h4>
        <input
          name="passwordConfirmation"
          type="password"
          required={true}
          onChange={this.handleChange}
        />
        </label>
        <div className="signup-error-box" onClick={this.disappear}>
          { this.state.errors }
        </div>
          <div className="button-containers signup-button-container">
            <button
              className="form-submit"
              type="submit"
              >Sign Up!</button>
          </div>
        </form>
      </div>
    )
  };
};

export default withRouter(NewUser);
