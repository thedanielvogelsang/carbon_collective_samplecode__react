import React, {Component} from 'react';
import Button from 'muicss/lib/react/button';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {post} from '../../api_client';
import './InviteSomeone-styles.css';


const EmailInputs = function(props){
    let placeholder;
    props.num === 0 ? placeholder = "Enter a friend's email" : placeholder = "email"
    return(
        <li className="email-input-row" key={props.num + 1}>
          <input
            type="text"
            name={props.num}
            className="invite-email-input"
            placeholder={placeholder}
            onChange={props.handleChange}
            />
        </li>
      )
  }

class InviteSomeonePage extends Component{
  constructor(){
    super();
    this.state = {
      emails: {},
      emailInputs: [],
      count: 1,
      message: null,
      messageDisplay: 'inline-block',
      emailDisplay: 'block',
      plusOneBtn: {display: 'block'},
    }
    this.handleValue = this.handleValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.addEmailInput = this.addEmailInput.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
    this.renderEmails = this.renderEmails.bind(this);
    this.goBackToDash = this.goBackToDash.bind(this);
  }

  componentDidMount(){
    this.renderEmails()
    this.logLanding()
  }

  componentDidUpdate(){
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

  goBackToDash(message){
    if(message.message === 'success'){
      var e;
      this.state.count > 1 ? e = "Emails" : e = "Email"
      alert(`${e} Sent. Tell your friends to check their inboxes!`)
      this.setState({emails: {},
      emailInputs: [],
      count: 1,
      message: null,
      messageDisplay: 'inline-block',
      emailDisplay: 'block',
      plusOneBtn: {display: 'block'},})
    }else{
      let emails = message.message
      alert(`Some of your invites could not be sent. The following people are already Carbon Collective members: ${emails}`)
      this.setState({emails: {},
      emailInputs: [],
      count: 1,
      message: null,
      messageDisplay: 'inline-block',
      emailDisplay: 'block',
      plusOneBtn: {display: 'block'},})
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
      .then(data => this.goBackToDash(data))
      .catch(error => this.goBackToDash(error))
  }

  renderEmails(num){
    let inputs = this.state.emailInputs;
    let i = inputs.length
    const em = (<EmailInputs key={i} num={i} handleChange={this.handleChange}/>)
    inputs.push(em)
    this.setState({
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
    let math;
    let btn = this.state.messageDisplay
    if(btn === "none"){
      btn = false
    }
    btn ? math = "Remove" : math = "Add"
    return(
      <div className="invite-list-page">
        <h3 className="edit-header invite-page">Invite your friends!</h3>
        <form
          onSubmit={this.handleForm}
          className="inviteSomeone-form"
          >
          <ul ref="invite-list" style={{display: this.state.emailDisplay}}>
            {this.state.emailInputs}
          </ul>
          <label className="invite-label" style={{display: this.state.messageDisplay}}>
              <h4> Leave a personal note below </h4>
              <textarea
                required={true}
                className="invitation-textBox"
                onChange={this.handleValue}
                name="message"
                rows="10"
                cols="40"
                spellCheck="true"
                placeholder="Hey All! It's me Chuck!...."
                />
          </label>
          <div className="add-email">
            <p style={this.state.plusOneBtn} className="addP">Add Email:</p>
            <Button className="plus-btn" variant="fab" color="#129941" name="add-invite-email-btn" onClick={this.addEmailInput} style={this.state.plusOneBtn}>+</Button>
            <p>{math} Personal Message:</p>
            {btn ?
            <Button className="plus-btn message" variant="fab" color="#129941" name="remove-invite-message-btn" onClick={this.removeMessage}>-</Button>
            : <Button className="plus-btn message" variant="fab" color="#129941" name="add-invite-message-btn" onClick={this.addMessage}>+</Button> }
          </div>
          <div
          className="invite-invite-div">
          <button
            type="submit"
            className="invite-invite-button"
            name="invite-form-btn"
            onClick={this.handleForm}
            >Invite</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateWithProps = (state) => {
  return({
    id: state.userInfo.user_id
  })
}
export default withRouter(connect(mapStateWithProps, null)(InviteSomeonePage));
