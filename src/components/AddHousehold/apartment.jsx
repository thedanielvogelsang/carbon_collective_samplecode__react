import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import ToggleButton from 'react-toggle-button';

const iconStyleOn = {
  fontShadow: '1px 1px black',
  color: 'rgb(18,153,65)',
  height: 18,
  width: 18,
  fontSize: 24,
}

const iconStyleOff = {
  fontShadow: '1px 1px black',
  color: 'white',
  height: 18,
  width: 18,
  fontSize: 24,
}

const ToggleButtonIcon = (props) => {
  return(
    <FontIcon className="material-icons" style={props.style}>{props.icon}</FontIcon>
  )
}

class Apartment extends Component{
  constructor(props){
    super(props);
    this.state = {
      value: props.apartment,
      style: iconStyleOff,
      icon: 'clear'
    }
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(value){
    if(value){
      this.setState({
        value: !value,
        style: iconStyleOff,
        icon: 'clear'
      })
    }else{
      this.setState({
        value: !value,
        style: iconStyleOn,
        icon: 'check_circle'
      })
    }
    let name = 'apartment'
    this.props.updateForm(name, !value)
  }

  render(){
    return(
      <div className="toggle-btn-apt">
        <h1 className="toggle-btn-text">NO</h1>
        <MuiThemeProvider>
          <ToggleButton
            colors={{
              activeThumb: {
                base: 'rgb(250,250,250)',
              },
              inactiveThumb: {
                base: 'rgba(255,0,0,0.5)',
              },
              active: {
                base: 'rgb(18,153,65)',
                hover: 'rgb(18,153,65)',
              },
              inactive: {
                base: 'rgb(65,66,68)',
                hover: 'rgb(95,96,98)',
              }
            }}
            containerStyle={{display:'inline-block',width:'80px'}}
            inactiveLabel=""
            activeLabel=""
            activeLabelStyle={{width: '35px'}}
            inactiveLabelStyle={{width: '35px'}}
            thumbIcon={<ToggleButtonIcon style={this.state.style} icon={this.state.icon}/>}
            trackStyle={{height: '30px', width: '80px'}}
            thumbStyle={{height: '30px', width: '30px'}}
            thumbAnimateRange={[1, 55]}
            value={ this.state.value || false }
            onToggle={(value) => this.handleToggle(value)} />
        </MuiThemeProvider>
        <h1 className="toggle-btn-text">YES</h1>

      </div>
    )
  }
}

export default Apartment;
