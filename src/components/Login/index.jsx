import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { post } from '../../api_client';

import './Login-styles.css';


class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: ""
    };
    this.handleLoginForm = this.handleLoginForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.disappear = this.disappear.bind(this);
    this.setSession = this.setSession.bind(this);
  }

  disappear(){
    this.setState({errors: ""})
  }

  goToPage(path) {
    this.props.history.push(path)
  };

  handleChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  setSession(data){
    let path = `${data.id}/user-logs-in`
    var d = new Date()
    console.log(d.toISOString())
    post(path)
      .then(ans => console.log())
      .catch(error => console.log(error))
    sessionStorage.setItem('user_id', data.id)
    if(data.house_ids && data.privacy_policy){
      setTimeout(this.goToPage, 600, '/dashboard')
      sessionStorage.setItem("house_id", data.house_ids[0])
    }else if(!data.privacy_policy){
      setTimeout(this.goToPage, 600, '/privacy-policy')
    }else{
      setTimeout(this.goToPage, 600, '/dashboard')
    }
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
    <div className="login-page">
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
          autoFocus
          type="text"
          required={true}
          inputMode="text"
          onChange={ this.handleChange }
          />
      </label>
      <label>
        <h4 className="login-email-label">Password </h4>
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
            className="login-button form-submit"
            name="login-btn"
            type="submit"
            >Login</button>
        </div>
      </form>
    </div>
    )
  };
};

export default withRouter(Login);
