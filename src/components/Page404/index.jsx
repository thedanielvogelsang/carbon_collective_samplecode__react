import React, {Component} from 'react'
import './Page404-styles.css'

class Page404 extends Component{
  constructor(){
    super();
    this.state = {
      noPage: "hidden",
      loading: "loader visible"
    }
    this.changeState = this.changeState.bind(this);
  }

  componentDidMount(){
    return this.changeState
  }

  changeState(){
    setTimeout(
    this.setState({
      noPage: 'visible',
      loading: "loader hidden"
    }), 5000)
  }
  render(){
    return(
      <div className="four-oh-four-page">
        <div className="four-oh-four-container">
          <div className={this.state.loading}></div>
          <div className={this.state.noPage}>
            <h1>The page you are looking for doesn't exist.</h1>
            <p>You may have mistyped the address or lack authorization to visit this page.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Page404;
