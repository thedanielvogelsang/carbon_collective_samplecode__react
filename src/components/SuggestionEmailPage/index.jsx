import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {post} from '../../api_client';
import './Suggestion-styles.css'


class SuggestionEmailPage extends Component{
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
    this.logLanding()
    // console.log(this.props.history)
  }

  logLanding(){
    let id = this.props.user_id
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

  postSuggestion(event){
    event.preventDefault();
    let user = this.state.userData
    let message = this.state.message
    const paramsData = {user: user, email_body: message}
    const path = "suggestions"
    if(confirm("Ready to email the team?")){
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
    alert("Thank you for your feedback.")
    this.props.history.push('/dashboard')
  }

  render(){
    return(
      <div className="email-form-container">
        <form
          className="form-container suggestion-form"
          onSubmit={this.postSuggestion}
          >
          <label>
            <h3 className="suggestion-title"> Send us a suggestion!</h3>
            <textarea
              required={true}
              className="suggestion-textBox"
              onChange={this.handleValue}
              name="message"
              spellCheck="true"
              rows="10"
              cols="40"
              placeholder="What could we do differently?"
              />
          </label>
          <button
            type="submit"
            className="suggestion-btn"
            >Send</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = function(state){
  return({
    user_id: state.userInfo.user_id,
  })
}

export default withRouter(connect(mapStateToProps, null)(SuggestionEmailPage));
