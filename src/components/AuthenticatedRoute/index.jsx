import React, {PropTypes} from "react"
import {withRouter} from "react-router-dom"

class AuthenticatedRoute extends React.Component {
  constructor(){
    super();
    this.redirectToLogin = this.redirectToLogin.bind(this);
  }
  redirectToLogin(){
    this.props.history.push('/')
  }
  render() {
    if (!this.props.loaded) {
      this.redirectToLogin()
      return null
    }
    return (
      React.createElement(this.props.component, this.props)
    )
  }
}

AuthenticatedRoute.propTypes = {
  loaded: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
}

export default withRouter(AuthenticatedRoute);
