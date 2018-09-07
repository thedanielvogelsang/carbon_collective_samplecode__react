import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import FontIcon from 'material-ui/FontIcon';
import ToggleButton from 'react-toggle-button';


class ChecklistToggle extends Component{
  constructor(props){
    super(props);
    let val;
    props.a === 'Yes' ? val = true : val = false
    this.state = {
      value: val,
      question: props.question,
      q: props.q
    }
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidUpdate(){
  }

  handleToggle(value){
    if(value){
      this.setState({
        value: !value,
      })
    }else{
      this.setState({
        value: !value,
      })
    }
    let val;
    value === true ? val = "No" : val = "Yes"
    this.props.updateChecklist(this.state.q, val)
  }

  render(){
    return(
      <form className={this.props.cName}>
        <div className="checklist-toggle-div">
        <label className="checklist-question-label">
        <h3>{this.state.question}</h3>
        <div className="toggle-btn">
          <h1 className="toggle-btn-txt">NO</h1>
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
              containerStyle={{display:'inline-block',width:'70px',height:'10px', margin:'0px 5px'}}
              inactiveLabel=""
              activeLabel=""
              activeLabelStyle={{width: '10px'}}
              inactiveLabelStyle={{width: '10px'}}
              trackStyle={{height: '10px', width: '40px', margin:'1px 5px'}}
              thumbStyle={{height: '10px', width: '10px'}}
              thumbAnimateRange={[2, 38]}
              value={ this.state.value || false }
              onToggle={(value) => this.handleToggle(value)} />
            </MuiThemeProvider>
            <h1 className="toggle-btn-txt">YES</h1>
          </div>
        </label>
        </div>
      </form>
    )
  }
}

export default ChecklistToggle;
