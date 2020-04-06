var dataset = {}; 
var series = {};
var len = null; 
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

var svg = d3.select("#vis").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + (margin.left/2) +  ", 0)")
  .append("g")
  .attr("transform", "translate(" + 1.5*margin.left + "," + (margin.top/2) + ")");

// key is supposed to be here but I removed the earthquake text 
var g = svg.append("g") 
    .attr("class", "key") 
    .attr("transform", "translate(" + 2*margin.right + ",100)"); 

d3.dsv(",", "example.csv", function(d, i) {

}).then(function(data) {
  
})