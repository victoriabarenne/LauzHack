var dataset = {}; 
var SIR = {};
var series = {};
var len = 0; 
var legend; 

var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = document.getElementById("vis").clientWidth
  , height = window.innerHeight - 2*margin.top - 2*margin.bottom;
var legendRectSize = 30;
var legendSpacing = 4;

var stack = d3.stack()
    .keys(["I", "S", "R"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

// var tip = d3.tip()
//   .attr("class", "d3-tip")
//   .offset([-10, 0]) // offset is for positioning (avoid overlap)
//   .html(function(d) {
//     return d.key;  }); // see what this gives 

var svg = d3.select("#vis")
  .append("svg")
  .attr("width", width)
  .attr("height", 2*margin.top);

var gTime = svg.append("g")
  .attr("transform", "translate(150, 30)");

var hTime = svg.append("g")
  .attr("transform", "translate(450, 30)")

svg.append("text")
.text("Parameter")
.attr("x", margin.top/1.3)
.attr("y", margin.left/1.3);

var svg = d3.select("#vis").append("svg")
  .attr("width", width)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + (margin.left/2) +  ", 0)")
  .append("g")
  .attr("transform", "translate(" + 1.5*margin.left + "," + (margin.top/2) + ")");

// key is supposed to be here but I removed the earthquake text 
var g = svg.append("g") 
    .attr("class", "key") 
    .attr("transform", "translate(" + 2*margin.right + ",100)"); 

// range for slider 
var parameter = d3.range(0, 2);

// function creating slider
var sliderTime = d3.sliderBottom()
  .min(d3.min(parameter))
  .max(d3.max(parameter))
  .step(1)
  .width(300)
  .default(0) 
  .on('onchange', handleChange); // handles thisYear

var rightNow = 0;
var after = d3.nest(); // to store data 

var promises = [d3.dsv(",", "example.csv", function(d, i) {
  return {
    ind: i,
    S: +d["S"+rightNow],
    I: +d["I"+rightNow],
    R: +d["R"+rightNow]
  }
})] // we will have to handle this by creating a csv file with multiple columns indexed by the parameter
             
function handleChange(val) {
  rightNow = val; // update value on cursor 
  promises[0] = d3.dsv(",", "example.csv", function(d, i) {
    return {
      ind: i,
      S: +d["S"+rightNow],
      I: +d["I"+rightNow],
      R: +d["R"+rightNow] }
  });
  d3.selectAll(".mylayers").remove();
  d3.selectAll(".xaxis").remove();
  d3.selectAll(".yaxis").remove();
  d3.selectAll(".color").remove();
  d3.selectAll(".legend").remove();
    d3.selectAll(".text").remove();


  Promise.all(promises).then(ready);
}

gTime.call(sliderTime);
Promise.all(promises).then(ready); 
// once we have changed the slider, we want the new data to appear 

function ready(data) {
  // svg.call(tip);
  series = stack(data[0]);
  len = series[0].length;

// I need to make everything disappear then appear again 

  var xScale = d3.scaleLinear()
    .domain([0, len]) // number of entries in each column of dataset 
    .range([0, width/2.9]); // 2.5 is for

  var yScale = d3.scaleLinear()
    .domain([0, 1000000])
    //.domain([0, series[0][0].data.S]) // S will have highest value since it can be tot pop
    .range([height, margin.top/2])
    .nice();

  var keys = ["I", "S", "R"];
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(["#F1716D", "#FCD186", "#CDEAA4"]);

  var area = d3.area()
    .x(function(d) { return xScale(d.data.ind); })
    .y0(function(d) { return yScale(d[0]); })
    .y1(function(d) { return yScale(d[1]); })

  var areaChart = svg.append("g")
    .attr("clip-path", "url(#clip)")

  areaChart
    .selectAll("mylayers")
    .data(series)
    .enter().append("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .attr("class", "color")

    // x axis
    svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)
      .tickPadding(10));

  // y axis
  svg.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yScale));

    svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(" + width/2.2 + "," + height + ")")
    .call(d3.axisBottom(xScale)
      .tickPadding(10));

  // y axis
  svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + width/2.2 + ",0)")
    .call(d3.axisLeft(yScale));

      areaChart
    .selectAll("mylayers")
    .data(series)
    .enter().append("path")
      .attr("transform", "translate(" + width/2.2 + ",0)")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .attr("class", "color")

    // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/1.25)
      .attr("y", height*1.09 )
      .text("Time elapsed");

  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("class", "text")
      .attr("y", -2)
      .text("Total Population")
      .attr("text-anchor", "start")
    

    legend = svg.selectAll(".legend")                    
      .data(keys)
      .enter().append("g") // setting the groups to append the rectangles 
      // .attr("class", "legend")                                 
      .attr("transform", function(d, i) {                   
        var hor = width/1.2;           
        var ver = 2.8*margin.top + i/1.3*margin.top;                 
        return "translate(" + hor + "," + ver + ")"; });    

  legend.append("rect")   
    .attr("class", "legend")                           
    .attr("width", legendRectSize)                  
    .attr("height", legendRectSize)                        
    .style("fill", function(d) {
      console.log(d)
      return color(d); })                          
    .style("stroke", function(d) {
      return color(d); });  

  legend.append("text")  
    .attr("class", "legend")                       
    .attr("x", legendRectSize + 4*legendSpacing)           
    .attr("y", 5.6*legendSpacing)              
    .text(function(d) { 
      return d; }) // this d comes from the legend data
    .style("font-size", 20)
    .style("text-anchor", "middle");  



}
