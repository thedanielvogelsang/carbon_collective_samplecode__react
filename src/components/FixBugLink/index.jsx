import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BugLink from './img/feedback.svg'
import './FixBugLink-styles.css';

const iconStyles = {
  color: '#bdbec0',
  height: 58,
  width: 58,
  fontSize: 36,
}
class FixBugLink extends Component{
  constructor(){
    super();
    this.goToBugsPage = this.goToBugsPage.bind(this);
  }

  goToBugsPage(path){
    this.props.history.push(path)
  }
  render(){
    return(
      <div className="bug-report-icon-fixed-div">
        <div className="bug-report-icon-container">
          <img alt="bug report icon" className="material-icons bug-report-icon-fixed" onClick={(e) => this.goToBugsPage('/bugs')} src={BugLink} />
          <div className="bug-prompt" style={{display: 'none'}} >
            <p>Find a Bug?</p>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(FixBugLink);
