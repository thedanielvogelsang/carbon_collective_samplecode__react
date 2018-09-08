import React, {Component} from 'react';
import GasChecklist from './checklists/gasChecklist';
import WaterChecklist from './checklists/waterChecklist';
import ElectricityChecklist from './checklists/electricityChecklist';
import './styles/Checklist-styles.css';

class Checklist extends Component{
  componentDidMount(){
  }

  componentDidUpdate(){
    // console.log('updating entire checklist')
  }

  shouldComponentUpdate(nextProps, nextState){
    // console.log(nextProps.resource, this.props.resource)
    if(nextProps.resource !== this.props.resource  && this._ismounted == true){
      return true
    }else{
      return false
    }
  }

  render(){
    let type = this.props.resource
    if(type === 'Gas'){
      return(
        <GasChecklist house={this.props.house} user={this.props.user}/>
      )
    }else if(type === 'Carbon'){
      return(
        <div className="checklist-dropdown">No carbon checklist yet</div>
      )
    }else if(type === 'Electricity'){
      return(
        <ElectricityChecklist house={this.props.house} user={this.props.user}/>
      )
    }else if(type === 'Water'){
      return(
        <WaterChecklist house={this.props.house} user={this.props.user}/>
      )
    }else{
      return(
        <div className="checklist-dropdown"></div>
      )
    }
  }
}

export default Checklist;
