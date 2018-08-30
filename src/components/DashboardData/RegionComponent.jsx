import React, {Component} from 'react';

function namify(name){
  switch(name){
    case "Household":
      return "households"
    case "Neighborhood":
      return "neighborhoods"
    case "City":
      return "cities"
    default:
      return "regions"
  }
}


export default class RegionComponent extends Component{
  render(){
    let name = namify(this.props.regionType)
    return(
      <div className="data-item-t">
        <a id={this.props.id} name={name} className="data-label-t clickable" onClick={this.props.linkAction}>{this.props.label}</a>
        <h6 className="data-value main" onClick={this.props.linkAction}>{this.props.monthlyAvg}</h6>
        <h6 className="data-value secondary" onClick={this.props.linkAction}>{this.props.parentAvg}</h6>
      </div>
    )
  }
}
