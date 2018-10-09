import React, {Component} from 'react';

function namify(name){
  switch(name){
    case "Me":
      return "my"
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
    let label = this.props.label;
    label === "Me" ? label = "My Average Use" : console.log();
    return(
      <div className="data-item-t">
        <a id={this.props.id} name={name} className="data-label-t clickable" onClick={this.props.linkAction}>{label}</a>
        <div class="label-div" style={{position: 'relative'}}>
          <h6 className="label-consumption">{this.props.metric} per month</h6>
        </div>
      </div>
    )
  }
}
//
// Original and stylized version of dash data display (side labels for graphs; place below .label-div)
// <div style={{position: 'relative'}}>
//   <h6 className="data-value main" onClick={this.props.linkAction}>{this.props.monthlyAvg}</h6>
//   <span className="svg-span up"><p>{name} average ({this.props.metric})</p></span>
// </div>
// <div style={{position: 'relative'}}>
//   <h6 className="data-value secondary" onClick={this.props.linkAction}>{this.props.parentAvg}</h6>
//   <span className="svg-span down"><p>{name} average</p></span>
// </div>
