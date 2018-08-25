import * as d3 from "d3";

var BasicChart = {}

BasicChart.enter = function(elem_, props){
  var color = props.color
  var dataVal = props.a
  var percenting = props.b
  var id = props.id
  let name = props.name
  let regionName = props.regionName
  dataVal = percenting - dataVal + 1
  // using 1. to give percentage threshold to val
  var data = [dataVal, percenting];

  var width = 220,
      barHeight = 30;

  var x = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, width]);

  elem_
      .attr("width", width)
      // .attr("height", barHeight); // excludes 2nd bar from showing

  var bar = elem_.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("name", name)
      .attr("id", id)
      .attr("class", regionName)
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", 0)
      .transition()
      .duration(1500)
      .attr("width", x)
      .attr("fill", color)
      .attr("height", barHeight - 1)
      .attr("name", name)
      .attr("id", id)
      .attr("class", regionName);

}

BasicChart.update = function(elem_, props){
  var color = props.color
  var dataVal = props.a
  var percenting = props.b
  var id = props.id
  let name = props.name
  let regionName = props.regionName
  dataVal = percenting - dataVal + 1
  // using 1. to give percentage threshold to val
  var data = [dataVal, percenting];


  var width = 220,
      barHeight = 30;

  var x = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, width]);

  var bar = elem_.selectAll("g").data(data)

  bar.selectAll("rect")
      .attr("width", 0)
      .transition()
      .duration(1500)
      .attr("width", x)
      .attr("fill", color)
      .attr("name", name)
      .attr("id", id)
      .attr("height", barHeight - 1)
      .attr("class", regionName);

  // bar.selectAll("text")
  //     .attr("x", function(d) { return x(d) - 3; })
  //     .attr("y", barHeight / 2.5)
  //     .attr("dy", ".60em")
  //     .text(function(){return String(props.a) + "/" + String(percenting)})

  //     .data(data)
  //     .enter()
  //     .classed("cheelloo")
  //     .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
  // console.log(elem_)
}

export {BasicChart};
