import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Timer from './Timer';
import {get, post} from '../../api_client';
import './InviteSomeone-styles.css';

const EmailInputs = function(props){
    let placeholder;
    props.num === 0 ? placeholder = "Enter a friend's email address" : placeholder = "Email address"
    return(
      <div className="invite-row-div">
        <li className="email-input-email" key={props.myKey}>
          <input
            type="text"
            name={props.num}
            className="invite-email-input"
            placeholder={placeholder}
            onChange={props.handleChange}
            />
        </li>
      </div>
      )
  }
const EmailInvite = function(props, n){
    let email = props.email;
    let color, text;
    props.emailActivated ? color = "green" : color = "red"
    props.emailActivated ? text = (<h5 className="accepted-text">{"Accepted: " + props.invited}</h5>) : text = (<Timer seconds={props.seconds} id={props.id}/>)
    return(
      <div className="invite-row-div invited" style={{color: color}}>
        <li className="email-input-email invited" key={props.myKey} >
          <div className="invite-cancel-div">
            <button
              className="invite-cancel-btn"
              name={email}
              onClick={(e) => props.deleteUserInvite(e, props.id)}
              >X
            </button>
          </div>
          <h5 className="email-text"> {email} </h5>
        </li>
        <li className="email-input-accepted">
            {text}
        </li>
      </div>
      )
  }

class InviteSomeonePage extends Component{
  constructor(){
    super();
    this.state = {
      emails: {},
      emailInputs: [],
      count: 1,
      message: "",
      messageDisplay: 'inline-block',
      plusOneBtn: {display: 'block'},
      loading: true,
    }
    this.handleValue = this.handleValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.addEmailInput = this.addEmailInput.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
    this.renderEmails = this.renderEmails.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.setInvitesToState = this.setInvitesToState.bind(this);
    this.deleteUserInvite = this.deleteUserInvite.bind(this);
    this.confirmSuccess = this.confirmSuccess.bind(this);
  }

  componentDidMount(){
    this.loadInvites(this.props.id)
    // this should come after fetch call with invite_max as num
    // this.renderEmails(3)
    this.logLanding()
  }

  componentDidUpdate(prevState, prevProps){
    // console.log(this.state)
  }

  loadInvites(id){
    let path = `${id}/invites`
    get(path)
      .then(data => this.setInvitesToState(data))
      .catch(error => console.log(error))
  }

  setInvitesToState(data){
    this.setState({
      userInvites: data,
      loading: false
    })
    setTimeout(this.renderEmails, 1000, this.props.invite_max)
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

  renderMessage(message){
    if(message.message === 'success'){
      var e;
      this.state.count > 1 ? e = "Emails" : e = "Email"
      this.setState({emails: {},
        emailInputs: [],
        count: 1,
        message: "",
        messageDisplay: 'inline-block',
        plusOneBtn: {display: 'block'}}, this.confirmSuccess(e))
    }else{
      let emails = message.message
      alert(`Some of your invites could not be sent. The following people are already Carbon Collective members: ${emails}`)
      this.setState({emails: {},
      emailInputs: [],
      count: 1,
      message: "",
      messageDisplay: 'inline-block',
      plusOneBtn: {display: 'block'},})
    }
  }

  confirmSuccess(e){
    if(confirm(`${e} Sent. Tell your friends to check their inboxes!`)){
      this.setState({
        loading: true
      }, this.loadInvites(this.props.id))
    }
  }

  deleteUserInvite(e, invite_id){
    e.preventDefault();
    let name = e.target.name;
    if(confirm(`Are you sure you want to remove ${name} from your list of invites?`)){
      let id = this.props.id
      let path = `${id}/cancel-invite/${invite_id}`
      this.setState({emailInputs: [], loading: true})
      post(path)
        .then(data => this.loadInvites(id))
        .catch(error => console.log(error))
    }
  }

  handleValue(event){
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  handleChange(event){
    const target = event.target
    const value = target.value
    const name = target.name
    let emailList = this.state.emails
    emailList[name] = value
    this.setState({
      emails: emailList
    })
  }

  handleForm(event){
    event.preventDefault();
    let emailData = {emails: this.state.emails, message: this.state.message}
    const id = this.props.id
    const path = `users/invite/${id}`
    post(path, emailData)
      .then(data => this.renderMessage(data))
      .catch(error => this.renderMessage(error))
  }

  renderEmails(num){
    let inputs, i, userInvites;
    let change = this.handleChange;
    inputs = this.state.emailInputs;
    userInvites = this.state.userInvites;
    for(i = 0; i < num; i++){
      let user = userInvites[i]
      let em;
      if(user){
        let key = user[0] + user[1]
         em = (<EmailInvite key={key} myKey={key} num={i} id={user[0]} email={user[1]} seconds={user[2]} invited={user[3]} emailActivated={user[4]} deleteUserInvite={this.deleteUserInvite}/>)
      }else{
         em = (<EmailInputs key={i} myKey={i} num={i} handleChange={change}/>)
      }
      inputs.push(em)
    }
    return this.setState({
      emailInputs: inputs
    })
  }

  addEmailInput(e){
    e.preventDefault();
    let ct = this.state.count;
    ct += 1;
    if(ct < 5){
      this.setState({
        count: ct
      }, this.renderEmails(ct))
    }else{
      this.setState({
        count: ct,
        plusOneBtn: {display: 'none'},
      }, this.renderEmails(ct))
    }
  }

  addMessage(e){
    e.preventDefault();
    this.setState({
      messageDisplay: 'inline-block'
    })
  }

  removeMessage(e){
    e.preventDefault();
    this.setState({
      messageDisplay: 'none'
    })
  }

  render(){
    let btn = this.state.messageDisplay
    let {message} = this.state.message
    let loading = this.state.loading
    if(btn === "none"){
      btn = false
    }
    return(
      <div className="invite-list-page">
        <h4 className="edit-header invite-page">Invite your friends!</h4>
        {loading ? <div></div> :
        <form
          onSubmit={this.handleForm}
          className="inviteSomeone-form"
          >
          <ul ref="invite-list">
            {this.state.emailInputs}
          </ul>
          <h4 className="leave-a-message">Leave a personal message:</h4>
          <label className="invite-label" style={{display: this.state.messageDisplay}}>
            <textarea
              className="invitation-textBox"
              onChange={this.handleValue}
              value={message}
              name="message"
              rows="10"
              cols="40"
              spellCheck="true"
              placeholder="Hey All! It's me Chuck!...."
              />
          </label>
          <div
          className="invite-invite-div">
          <button
            type="submit"
            className="invite-invite-button"
            name="invite-form-btn"
            onClick={(e) => this.handleForm(e)}
            >Invite</button>
          </div>
        </form> }
      </div>
    )
  }
}

const mapStateWithProps = (state) => {
  return({
    id: state.userInfo.user_id,
    dash_data: state.userInfo.dash_data,
    invite_max: state.userInfo.data.invite_max,
  })
}
export default withRouter(connect(mapStateWithProps, null)(InviteSomeonePage));
