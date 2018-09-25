import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { post } from '../../api_client';

import './ResetPasswordPage-styles.css'

// this component is for a new-user who has been invited
class ResetPasswordPage extends Component {
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
    this.disappear = this.disappear.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  componentDidMount(){
    let id = this.props.location.pathname.match(/\d+/)[0]
    this.setState({
      id: id,
    })
  }

  goToPage(path) {
    this.props.history.push(path)
  };

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
    alert("Password reset successful. Please login with your email and new password to continue.")
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
        <h3 className="edit-header reset-password-page"> Password Reset </h3>
        <form
          className="form-container signup-form"
          onSubmit={ this.handleSignupForm }
        >
        <label>
        <h4 className="new-user-label"> New password </h4>
        <input
          name="password"
          required={true}
          type="password"
          onChange={this.handleChange}
         />
        </label>
        <label>
        <h4 className="new-user-label"> Confirm new password </h4>
        <input
          name="passwordConfirmation"
          type="password"
          required={true}
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
            >Confirm Reset!</button>
        </div>
        </form>
      </div>
    )
  };
};

export default withRouter(ResetPasswordPage);
