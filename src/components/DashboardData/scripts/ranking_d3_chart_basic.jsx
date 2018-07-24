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

  // runTest2(props){
  //   var color = props.color
  //   console.log(props)
  //   var dataVal = props.a
  //   console.log(dataVal)
  //   var percenting = props.b
  //   console.log(percenting)
  //   dataVal = percenting - dataVal + 1
  //   var chartName = "." + props.chartName
  //   // using 1. to give percentage threshold to val
  //   var data = [dataVal, percenting];
  //   console.log(data)
  //   var width = 220,
  //       barHeight = 30;
  //
  //   var x = d3.scaleLinear()
  //       .domain([0, d3.max(data)])
  //       .range([0, width]);
  //
  //   var chart = d3.select(chartName)
  //       .attr("width", width)
  //       .attr("height", barHeight); // excludes 2nd bar from showing
  //
  //   var bar = chart.selectAll("g")
  //       .data(data)
  //       .enter()
  //       .append("g")
  //       .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
  //
  //   bar.append("rect")
  //       .attr("width", 0)
  //       .transition()
  //       .duration(1500)
  //       .attr("width", x)
  //       .attr("fill", color)
  //       .attr("height", barHeight - 1);
  //       .attr("id", props.id)
  //
  //   bar.append("text")
  //       .attr("x", function(d) { return x(d) - 3; })
  //       .attr("y", barHeight / 2.5)
  //       .attr("dy", ".60em")
  //       .text(function(){return String(props.a) + "/" + String(percenting)})
  //
  // }

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
