import React, {Component} from 'react';

function namify(name){
  switch(name){
    case "Household":
      return "households"
    case "Neighborhood":
      return "neighborhoods"
    case "City":
      return "cities"
  };

}
function visible(name){
  switch(name){
    case "Household":
      return "hidden"
    default:
      return "visible"
  };

}

export class MeComponent extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }
  render(){
    return(
      <div id="my-avg-use-div" className="data-item-t">
        <a id="my-avg-use-link" name="personal" className="data-label-t" >Me</a>
        <h6 id="my-avg-use-score" className="data-value">{ this.props.monthlyAvg }</h6>
      </div>
    )
  }
}

export class RegionComponent extends Component{
  render(){
    let visibility = visible(this.props.label)
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
