import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {post} from '../../api_client';
import './Fixbug-styles.css'


class FixBugPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      userData: props.userData,
      message: null,
    }
    this.postSuggestion = this.postSuggestion.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.goBackToDash = this.goBackToDash.bind(this);
  }

  componentDidMount(){
    // console.log(this.props.history)
  }

  postSuggestion(event){
    event.preventDefault();
    let user = this.props.userData
    let message = this.state.message
    const paramsData = {user: user, email_body: message}
    const path = "bugs"
    if(confirm("Are you ready to email the team?")){
      post(path, paramsData)
        .then(this.goBackToDash())
        .catch(error => console.log(error))
    }
  }

  handleValue(e){
    let target = e.target
    const value = target.value
    this.setState({
      message: value,
    })
  }

  goBackToDash(){
    alert("Thank you for your feedback. We'll get right on it!")
    this.props.history.push('/dashboard')
  }

  render(){
    return(
      <div className="email-form-container">
        <form
          className="form-container bug-form"
          onSubmit={this.postSuggestion}
          >
          <h3 className="bug-fix-title"> Have you detected an issue?</h3>
          <p className="bug-directions1">CarbonCollective is in its alpha phase of development, and issues are to be expected. Please tell us in as much detail as you can about the problem. Please make sure to include the following:</p><br/>
          <p className="bug-directions"> (1) What url (or webpage) did the issue occur on?</p>
          <p className="bug-directions"> (2) What triggered the issue?</p>
          <p className="bug-directions">(3) What is the issue?</p>
          <textarea
            required={true}
            className="bug-textBox"
            onChange={this.handleValue}
            name="message"
            rows="10"
            cols="40"
            spellCheck="true"
            placeholder="Tell us what went wrong"
            />
          <button
            type="submit"
            name='fixbug-submit-btn'
            className="bug-btn"
            >Send</button>
        </form>
      </div>
    )
  }
}

export default withRouter(FixBugPage);
