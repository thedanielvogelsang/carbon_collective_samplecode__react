import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { post } from '../../api_client';

import './NewUser-styles.css'

// this component is for a new-user who has been invited
class NewUserSignup extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      errors: "",
      first: "",
      last: "",
      email_confirmed: true,
      password: "",
      passwordConfirmation: ""
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
    localStorage.clear();
    let id = this.props.location.pathname.match(/\d+/)[0]
    this.setState({
      id: id,
    })
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
      .then(data => this.handleSuccess())
      .catch(
        error => this.handleErrors(error)
      )
  }

  handleSuccess(){
    alert("Welcome to Carbon Collective! Your email has been confirmed. Please log in to the app to continue.")
    const path = '/'
    this.goToPage(path)
  }

  handleErrors(error){
    if(error.errors !== "Please confirm your email address to continue"){
      this.setState({errors: error.errors})
    }else{
      this.props.history.push('/confirm-address')
      alert("Please confirm your email address to continue!")
    }
  }

  render() {
    return (
      <div className="signup-page-div">
      <h3 className="edit-header signup-page"> New User Signup </h3>
        <form
          className="form-container signup-form"
          onSubmit={ this.handleSignupForm }
        >
        <label>
        <h4 className="new-user-label"> First Name </h4>
        <input
          autoFocus
          required={true}
          name="first"
          type="text"
          onChange={this.handleChange}
        />
        </label>
        <label>
        <h4 className="new-user-label"> Last Name </h4>
        <input
          required={true}
          name="last"
          type="text"
          onChange={this.handleChange}
        />
        </label>
        <label>
        <h4 className="new-user-label"> Password </h4>
        <input
          name="password"
          required={true}
          type="password"
          onChange={this.handleChange}
         />
        </label>
        <label>
        <h4 className="new-user-label"> Confirm Password </h4>
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
            className="form-submit signup-btn-submit"
            type="submit"
            >Sign Up!</button>
        </div>
        </form>
      </div>
    )
  };
};

export default withRouter(NewUserSignup);
