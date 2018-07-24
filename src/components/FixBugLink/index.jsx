import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import {withRouter} from 'react-router-dom';
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
      <div className="bug-report-icon-fixed-container">
        <MuiThemeProvider>
          <FontIcon className="material-icons bug-report-icon-fixed" onClick={(e) => this.goToBugsPage('/bugs')} style={iconStyles}>bug_report</FontIcon>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default withRouter(FixBugLink);
