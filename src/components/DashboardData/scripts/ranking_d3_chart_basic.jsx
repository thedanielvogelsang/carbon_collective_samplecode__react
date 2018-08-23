import React, {Component} from 'react';
import * as d3 from "d3";
import {BasicChart} from './update_d3_chart_basic';

export default class BarGraph extends Component{
  constructor(props){
    super(props);
    this.state = {
      a: props.a,
      b: props.b,
      svgName: "chart " + props.chartName,
    }
  }

    shouldComponentUpdate(){
      return false
    }

    componentDidMount(){
      var chartName = "." + this.props.chartName
      let x = d3.select(chartName)
      BasicChart.enter(x, this.props)
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.color !== this.props.color){
        var chartName = "." + this.props.chartName
        let x = d3.select(chartName)
        BasicChart.update(x, nextProps)
      }
    }

  render(){
    let loading = this.state.loading;
    if(loading){
      return(
        <div></div>
      )
    }else{
       return(
         <svg id={this.props.id} name={this.props.name} className={this.state.svgName} onClick={this.props.goToRegionPage} >
         </svg>
       )
     }
   }
}
