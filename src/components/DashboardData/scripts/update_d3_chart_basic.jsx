import * as d3 from "d3";

var BasicChart = {}

BasicChart.enter = function(elem_, props){
  var color = props.color
  var dataVal = props.a
  var id = props.id
  let name = props.name
  let regionName = props.regionName
  // dataVal = percenting - dataVal + 1
  // using 1. to give percentage threshold to val
  var data = [dataVal];
  console.log(data)
  let windowWidth = document.getElementById('root').clientWidth
  // console.log(dataVal, props.c)

  let wcw = function(ww){
    if(ww > 360){
      return 220
    }else if(ww > 319){
      return 180
    }else if(ww > 290){
      return 200
    }else{
      return 180
    }
  }

  var width = wcw(windowWidth);
  var barHeight = 30;

  var x = d3.scaleLinear()
      .domain([0, props.c])
      .range([0, width]);

  elem_
      .attr("width", width)
      .attr("height", barHeight); // excludes 2nd bar from showing if smaller than 30

  var bar = elem_.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("name", name)
      .attr("id", id)
      .attr("class", regionName)
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  console.log(props.a)
  bar.append("rect")
      .attr("width", 0)
      .transition()
      .duration(1500)
      .attr("width", props.a)
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
  // dataVal = percenting - dataVal + 1
  // using 1. to give percentage threshold to val
  var data = [dataVal, percenting];


  let windowWidth = document.getElementById('root').clientWidth

  let wcw = function(ww){
    if(ww > 360){
      return 220
    }else if(ww > 310){
      return 200
    }else{
      return 180
    }
  }

  var width = wcw(windowWidth);
  var barHeight = 30;

  // var x = d3.scaleLinear()
  //     .domain([0, props.c])
  //     .range([0, width]);

  var bar = elem_.selectAll("g").data(data)

  bar.selectAll("rect")
      .attr("width", 0)
      .transition()
      .duration(1500)
      .attr("width", props.a)
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
