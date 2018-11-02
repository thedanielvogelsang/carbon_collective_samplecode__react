import React, {Component} from 'react';
import ReactExpandableViewList from 'react-expandable-listview';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {get, put, post} from '../../api_client';
import {userLogout} from '../../actions/userActions.js';
import './UserSettings-styles.css';

class UserSettings extends Component{
  constructor(){
    super();
    this.state = {
      loading: true
    }
    this.updateUser = this.updateUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.setInitialSettingState = this.setInitialSettingState.bind(this);
    this.removeUserAccount = this.removeUserAccount.bind(this);
    this.confirmAndLogout = this.confirmAndLogout.bind(this);
  }

  componentDidMount(){
    this.setInitialSettingState()
    this.logLanding()
  }

  setInitialSettingState(){
    get(`api/v1/users/${this.props.id}`)
      .then(data => this.setState({first: data.first, last: data.last, email: data.email, loading: false}))
      .catch(error => console.log(error))
  }

  logLanding(){
    let id = this.props.id
    let page = this.props.history.location.pathname
    let path = `${id}/page-land`
    let datum = {user_behavior: {
      pageName: page,
        }
      }
    post(path, datum)
     .then(data => console.log())
     .catch(error => console.log(error))
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  removeUserAccount(){
    if(confirm("Warning: this cannot be undone!\nAre you sure you want to delete your account? You will need to be invited back by a CarbonCollective member to create a new one!")){
      let id = this.props.id
      let path = `${id}/delete-account`
      post(path)
        .then(data => this.confirmAndLogout())
        .catch(error => alert("We're sorry, something went wrong. If this issue continues, report the issue to our developers and we'll respond asap"))
    }
  }

  goToPage(path){
    this.props.history.push(path)
  }

  logPageChange(path){
    let id = this.props.id
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

  updateUser(event){
    const target = event.target;
    const name = target.name;
    const id = this.props.id
    if(target.value === ''){
      target.placeholder = this.state[name]
    }else{
    const userUpdate = this.state[name]
    const userUpdateData = {user: {[name]: userUpdate}}
    const path = `users`
    put(path, id, userUpdateData)
      .then(data => console.log())
      .catch(error => console.log(error))
    }
  }

  confirmAndLogout(){
    alert('user account deleted')
    this.props.userLogout();
    localStorage.clear();
    setTimeout(this.goToPage, 400, '/')
    setTimeout(this.resetPage, 500)
  }

  resetPage(){
    return location.reload()
  }

  render(){
    let loading = this.state.loading
    if (!loading) {
      return(
        <div className="usrForm-cnt">
        <div className="users-editform-container">
        <h1 className="edit-header user-settings">{this.state.first + "'"}s Profile</h1>
        <div className="form-outside-container">
          <form
            className="form-container users-editform"
          >
          <h5> First Name </h5>
          <input
            onChange={this.handleChange}
            onFocus={(e) => e.target.placeholder = ''}
            onBlur={this.updateUser}
            placeholder={this.state.first}
            name="first"
            type="text"
            />
          <h5> Last Name </h5>
          <input
            onChange={this.handleChange}
            onFocus={(e) => e.target.placeholder = ''}
            onBlur={this.updateUser}
            placeholder={this.state.last}
            name="last"
            type="text"
            />
          <h5> Email </h5>
          <input
            onChange={this.handleChange}
            onFocus={(e) => e.target.placeholder = ''}
            onBlur={this.updateUser}
            placeholder={this.state.email}
            name="email"
            type="text"
            />
          </form>
          </div>
          <div className='passwordUpdate'>
            <PasswordInput id={this.props.id}/>
          </div>
          <div className="house-info-link-div">
            <button
              className="delete-acct-link"
              onClick={this.removeUserAccount}
              >delete account?</button>
          </div>
        </div>
        </div>
      )
    }else{
      return(
        <div></div>
      )
    }
  }
}

class PasswordForm extends Component{
  constructor(props){
    super(props)
    this.state = ({

    })
    this.handleForm = this.handleForm.bind(this)
  }

  checkImageHeight(){
      var root = document.getElementById('root')
      var image = document.getElementById('app-background-image')
      image.style.height = root.offsetHeight + "px"
  }

  handleForm(event){
    event.preventDefault();
    const oldPassword = document.getElementById('old-pass-input').value;
    const password = document.getElementById('pass-input').value;
    const updatedPassword = {user: {old_password: oldPassword, password: password}}
    const passwordConfirm = document.getElementById('pass-confirm-input').value;
    const path = 'users';
    const id = this.props.id
    if(password === passwordConfirm){
      put(path, id, updatedPassword)
        .then(data => this.props.setErrors('success'))
        .catch(error => this.props.setErrors(error.errors))
    }else{
      this.props.setErrors('newpass-mismatch-error')
    }
  }

  render(){
    return(
      <form
        className='password-form user-settings'
        onSubmit={this.handleForm}
        >
        <label>
        <h4> Confirm Old Password </h4>
        <input
          id="old-pass-input"
          name="password"
          required={true}
          type="password"
         />
        </label>
        <label>
        <h4> New Password </h4>
        <input
          id="pass-input"
          name="password"
          required={true}
          type="password"
         />
        </label>
        <label>
        <h4> Confirm New Password </h4>
        <input
          id="pass-confirm-input"
          name="passwordConfirmation"
          type="password"
          required={true}
        />
        </label>
        <div className="confirm-password-container">
          <button
            className="change-pass-button"
            type="submit"
            >confirm password change</button>
        </div>
      </form>
  )}
};


class PasswordInput extends Component{
  constructor(){
    super();
    this.state = {
      loading: false,
      errors: '',
      errorbox: {display: 'none'},
      data: []
    }
    this.disappear = this.disappear.bind(this)
    this.setErrors = this.setErrors.bind(this)
    this.closePassword = this.closePassword.bind(this)
  }

  componentDidMount(){
    this.setState({
    data: [{
      headerName: 'PASSWORD CHANGE',
      isOpened: false,
      height: 340,
      isReactComponent: true,
      items: [
        (
          <PasswordForm id={this.props.id} setErrors={this.setErrors}/>
        ),
      ],
    }],
    loading: true
    });
  }

  disappear(){
    this.setState({errors: "", errorbox: {display: 'none'}})
  }

  closePassword(){
    document.getElementById('passwordFile').children[0].children[0].children[0].children[0].children[1].style.height = 0
  }

  setErrors(message){
    if(message === 'newpass-mismatch-error'){
    this.setState({
        errors: "Passwords did not match.",
        errorbox: {display: 'flex'}
      });
    }else if(message === 'success'){
      this.closePassword()
      this.setState({
        errors: "password updated",
        errorbox: {display: 'flex', color: 'green'},
        loading: true
      });
    }else{
      this.setState({
        errors: message,
        errorbox: {display: 'flex'}
      })
    }
  }

  render(){
    if(this.state.loading){
    return(
        <div className='list-container' >
          <div className="error-box-pass" style={this.state.errorbox} onClick={this.disappear}>
            { this.state.errors }
          </div>
          <div id="passwordFile" className="expandable-password" >
            <ReactExpandableViewList
              data={this.state.data}
              headerAttName="headerName"
              itemsAttName="items"
              />
          </div>
        </div>
    )} else {
      return(
        <div>
        </div>
      )
    }
  };
};

const mapStateWithProps = function(state){
  return({
    id: state.userInfo.user_id,
  })
}

export default withRouter(connect(mapStateWithProps, {userLogout})(UserSettings));
