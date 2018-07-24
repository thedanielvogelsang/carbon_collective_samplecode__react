import React, {PropTypes} from "react"
import {withRouter} from "react-router-dom"

class HouselessRoute extends React.Component {
  constructor(){
    super();
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }

  componentDidMount(){
  }

  redirectToDashboard(){
    this.props.history.push('/dashboard')
  }

  render() {
    if (this.props.house) {
      this.redirectToDashboard()
      return null
    }
    return (
      React.createElement(this.props.component, this.props)
    )
  }
}

HouselessRoute.propTypes = {
  loaded: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
}

export default withRouter(HouselessRoute);
