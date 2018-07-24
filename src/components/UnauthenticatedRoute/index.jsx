import React, {PropTypes} from "react"
import {withRouter} from "react-router-dom"

class UnauthenticatedRoute extends React.Component {
  constructor(){
    super();
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }

  redirectToDashboard(){
    this.props.history.push('/dashboard')
  }

  render() {
    if (this.props.loaded) {
      this.redirectToDashboard()
      return null
    }
    return (
      React.createElement(this.props.component, this.props)
    )
  }
}

UnauthenticatedRoute.propTypes = {
  loaded: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
}

export default withRouter(UnauthenticatedRoute);
