import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {put, post} from '../../api_client';
import "./PrivacyPage-styles.css";

class PrivacyPage extends Component{
  constructor(){
    super();
    this.state = {
      accept: false,
    }
    this.handlePrivacyForm = this.handlePrivacyForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }

  componentDidMount(){
    this.logLanding()

    // console.log('trying')
  }

  componentDidUpdate(){
    // console.log(this.state.accept)
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


  goToPage(path){
    this.logPageChange(path)
    this.props.history.push(path)
  }

  handlePrivacyForm(e){
    e.preventDefault();
    let accept = e.target.name
    let answer = this.state.accept
    let id = this.props.id
    if(accept === "true" && answer === true){
      const path = `users`
      const data = {user: {privacy_policy: answer}}
      put(path, id, data)
        .then(data => this.handleResponse(data))
        .catch(error => console.log(error))
    }else if(accept === "true" && answer === false){
      alert("To continue, please accept our conditions by checking the box.")
    }else{
      if(confirm("You have chosen to decline our policy. This means you can't use our app. Are you sure you want to do this?")){
        this.goToPage('/')
      }else{
        return null
      }
    }
  }

  handleResponse(data){
    let priv = data.privacy_policy
    let house = this.props.house_id
    if(priv && house){
      this.goToPage('/dashboard')
    }else if(priv === true && !house){
      this.goToPage('/search_address')
    }else{
      alert("Something went wrong, please try again")
    }
  }

  handleChange(e){
    let val = this.state.accept
    this.setState({
      accept: !val
    })
  }

  render(){
    return(
      <div className="privacy-page">
        <div className="privacy-notice">
          <div className="privacy-header">
            <h1>Privacy Policy</h1>
          </div>
          <div className="privacy-text">
            <p>
            Here at Carbon Collective, we understand your privacy is valuable. We believe that an individual's data is their personal property and we are dedicated to providing transparency in our use.
            </p>
            <p>
            By using this application, you agree to provide us access to your identifying information for the purpose of collection and analysis within our company. We commit to storing this information securely and we will never sell personally identifying or contact information. Carbon Collective reserves the rights to share and monetize our anonymized data-set in the future. We will ensure the individual will be able to opt-out and delete their information. We also reserve the right to change this policy at any time and will provide notification of such. Thank you for participating and helping to build a more sustainable future.
            </p>
          </div>
        </div>
        <div className='privacy-form-div'>
          <form
            className="privacy-form"
            // onSubmit={this.handlePrivacyForm}
            >
            <div className="privacy-notice-checkbox">
                <h4>*</h4>
                <h4><span>by checking this box, I agree to these terms and conditions</span></h4>
                <div className="input-div">
                  <input
                    type="checkbox"
                    onChange={this.handleChange}
                    />
                </div>
            </div>
            <div className="accept-container">
              <button
                className="accept-privacy-notice-btn decline"
                type="submit"
                name={false}
                onClick={(e) => this.handlePrivacyForm(e)}
                >I Decline</button>
              <button
                className="accept-privacy-notice-btn accept"
                type="submit"
                name={true}
                onClick={(e) => this.handlePrivacyForm(e)}
                >I Accept</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
  })
}

export default withRouter(connect(mapStateToProps, null)(PrivacyPage));
