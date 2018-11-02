import * as d3 from "d3";

var BasicChart = {}

BasicChart.enter = function(elem_, props){
  var color = props.color;
  if(!props.up){color = '#c0c2c2'}
  var barWidth = props.a;
  var parentMax = props.c;
  var id = props.id;
  let name = props.name;
  let regionName = props.regionName;

  var data = [barWidth];
  let windowWidth = document.getElementById('root').clientWidth

  let wcw = function(ww){
    if(ww > 400){
      return 310
    }else if(ww > 300){
      return 250
    }else if(ww < 310){
      return 220
    }else{
      return 200
    }
  }

  var width = wcw(windowWidth);
  var barHeight = 30;

  var scale = d3.scaleLinear()
      .domain([0, parentMax])
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

  bar.append("rect")
      .attr("width", 0)
      .transition()
      .duration(1500)
      .attr("width", function(){if(Number(barWidth) !== 0){return scale(barWidth) - 1}})
      .attr("fill", color)
      .attr("height", barHeight - 1)
      .attr("name", name)
      .attr("id", id)
      .attr("class", regionName);
      // .attr("fill-opacity", function(d){
      //   return d / parentMax
      // })

  // bar.append("text")
  //     .attr("x", function(d) { return scale(d) - 30; })
  //     .attr("y", barHeight / 2.5)
  //     .attr("dy", ".60em")
  //     .text(function(d){
  //       if(d <= props.b){
  //         return "great!"
  //       }
  //     })
  //     .data(data)
  //     .enter()
  //     .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
}

BasicChart.update = function(elem_, props){
  var color = props.color
  if(!props.up){color = '#c0c2c2'}
  var barWidth = props.a;
  var parentMax = props.c;
  var id = props.id
  let name = props.name
  let regionName = props.regionName

  var data = [barWidth];
  let windowWidth = document.getElementById('root').clientWidth

  let wcw = function(ww){
    if(ww > 400){
      return 310
    }else if(ww > 300){
      return 250
    }else if(ww < 310){
      return 220
    }else{
      return 200
    }
  }

  var width = wcw(windowWidth);
  var barHeight = 30;

  var scale = d3.scaleLinear()
      .domain([0, parentMax])
      .range([0, width]);

  var bar = elem_.selectAll("g").data(data)

  bar.selectAll("rect")
      .attr("width", 0)
      .transition()
      .duration(1500)
      .attr("width", function(){if(Number(barWidth) !== 0){return scale(barWidth) - 1}})
      .attr("fill", color)
      .attr("name", name)
      .attr("id", id)
      .attr("height", barHeight - 1)
      .attr("class", regionName)
}

export {BasicChart};
