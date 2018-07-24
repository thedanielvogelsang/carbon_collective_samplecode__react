import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {post} from '../../api_client';
import './ExpandForm-styles.css'


class ExpandForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      userData: props.userData,
      message: null,
    }
    this.postSuggestion = this.postSuggestion.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.goBackToDash = this.goBackToHome.bind(this);
  }

  componentDidMount(){
  }

  postSuggestion(event){
    event.preventDefault();
    let user = this.state.userData
    let message = this.state.message
    const paramsData = {user: user, email_body: message}
    const path = "expansions"
    if(confirm("Ready to email the team?")){
      post(path, paramsData)
        .then(this.goBackToHome())
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

  goBackToHome(){
    let path = '/'
    this.props.history.push(path)
  }

  render(){
    return(
      <div className="email-form-container">
        <form
          className="form-container suggestion-form"
          onSubmit={this.postSuggestion}
          >
          <label>
            <h4 className="expand-request-directions"> Let us know where you live so we can prioritize your area next!</h4>
            <textarea
              required={true}
              cols="50"
              rows="30"
              className="expansion-textBox"
              type="textarea"
              spellcheck="true"
              onChange={this.handleValue}
              name="message"
              placeholder="Where should we go next?"
              />
          </label>
          <button
            type="submit"
            name="expand-form-btn"
            className="suggestion-btn"
            >Send Suggestion</button>
        </form>
      </div>
    )
  }
}

export default withRouter(ExpandForm);
