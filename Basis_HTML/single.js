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

// // slider left
var gTime = svg.append("g")
  .attr("transform", "translate(" + (width/1.5) + ", 120)");

var g2Time = svg.append("g")
  .attr("transform", "translate(" + width/1.5 + ", 180)");

var g3Time = svg.append("g")
  .attr("transform", "translate(" + width/1.5 + ", 240)");

svg.append("text")
.text("\u03BC" + "G")
.attr("x", (width/1.5-margin.left))
.attr("y", 128);

svg.append("text")
.text("\u03BC"+"L")
.attr("x", (width/1.5-margin.left))
.attr("y", 188);

svg.append("text")
.text("D")
.attr("x", (width/1.5-margin.left))
.attr("y", 248);

// function creating slider
var muG = d3.sliderBottom()
  .min(0.25)
  .max(2)
  .tickValues([0.25, 0.75, 2])
  .tickFormat(d3.format(',.2f'))
  .width(200)
  .marks([.25, 0.75, 2])
  .on('onchange', handleChange1); // handles thisYear

var muL = d3.sliderBottom()
  .min(1)
  .max(3)
  .tickValues([1, 2, 3])
  .tickFormat(d3.format(',.0f'))
  .step(1)
  .width(200)
  .on('onchange', handleChange2);

var L = d3.sliderBottom()
  .min(7)
  .max(20)
  .tickValues([7,20])
  .width(200)
  .step(13) 
  .on('onchange', handleChange3);

var rightNow = [0.25, 1, 7];

var promises = [d3.dsv(",", "https://raw.githubusercontent.com/victoriabarenne/LauzHack/master/Basis_HTML/example.csv", function(d, i) {
  return {
    ind: i,
    S: +d["S"+rightNow[0]+rightNow[1]+rightNow[2]],
    I: +d["I"+rightNow[0]+rightNow[1]+rightNow[2]],
    R: +d["R"+rightNow[0]+rightNow[1]+rightNow[2]]
  }
})] // we will have to handle this by creating a csv file with multiple columns indexed by the parameter

function handleChange1(val) { // val is the current value on the slider
  rightNow[0] = val; // update value on cursor 

  promises[0] = d3.dsv(",", "https://raw.githubusercontent.com/victoriabarenne/LauzHack/master/Basis_HTML/example.csv", function(d, i) {
    return {
      ind: i,
      S: +d["S"+rightNow[0]+rightNow[1]+rightNow[2]],
      I: +d["I"+rightNow[0]+rightNow[1]+rightNow[2]],
      R: +d["R"+rightNow[0]+rightNow[1]+rightNow[2]] }
  });
  d3.selectAll(".left").remove();
  Promise.all(promises).then(ready1);
}

function handleChange12(val) { // val is the current value on the slider
  rightNow[0] = val; // update value on cursor 

  promises[0] = d3.dsv(",", "https://raw.githubusercontent.com/victoriabarenne/LauzHack/master/Basis_HTML/example.csv", function(d, i) {
    return {
      ind: i,
      S: +d["S"+rightNow[0]+rightNow[1]+rightNow[2]],
      I: +d["I"+rightNow[0]+rightNow[1]+rightNow[2]],
      R: +d["R"+rightNow[0]+rightNow[1]+rightNow[2]] }
  });
    d3.selectAll(".right").remove();
  Promise.all(promises).then(ready2);
}


function handleChange2(val) { // val is the current value on the slider
  rightNow[1] = val; // update value on cursor

  promises[0] = d3.dsv(",", "https://raw.githubusercontent.com/victoriabarenne/LauzHack/master/Basis_HTML/example.csv", function(d, i) {
    return {
      ind: i,
      S: +d["S"+rightNow[0]+rightNow[1]+rightNow[2]],
      I: +d["I"+rightNow[0]+rightNow[1]+rightNow[2]],
      R: +d["R"+rightNow[0]+rightNow[1]+rightNow[2]] }
  });
    d3.selectAll(".left").remove();
  Promise.all(promises).then(ready1);
}

function handleChange22(val) { // val is the current value on the slider
  rightNow[1] = val; // update value on cursor

  promises[0] = d3.dsv(",", "https://raw.githubusercontent.com/victoriabarenne/LauzHack/master/Basis_HTML/example.csv", function(d, i) {
    return {
      ind: i,
      S: +d["S"+rightNow[0]+rightNow[1]+rightNow[2]],
      I: +d["I"+rightNow[0]+rightNow[1]+rightNow[2]],
      R: +d["R"+rightNow[0]+rightNow[1]+rightNow[2]] }
  });
    d3.selectAll(".right").remove();
  Promise.all(promises).then(ready2);
}


function handleChange3(val) { // val is the current value on the slider
  rightNow[2] = val; // update value on cursor 
  promises[0] = d3.dsv(",", "https://raw.githubusercontent.com/victoriabarenne/LauzHack/master/Basis_HTML/example.csv", function(d, i) {
    return {
      ind: i,
      S: +d["S"+rightNow[0]+rightNow[1]+rightNow[2]],
      I: +d["I"+rightNow[0]+rightNow[1]+rightNow[2]],
      R: +d["R"+rightNow[0]+rightNow[1]+rightNow[2]] }
  });
    d3.selectAll(".left").remove();
  Promise.all(promises).then(ready1);
}

gTime.call(muG); // muG for left graph
g2Time.call(muL); // muL for left graph 
g3Time.call(L);

Promise.all(promises).then(ready); // the one called by default 

function ready(data) {
  dataset = data[0];
  series = stack(data[0]);
  if (dataset.find(element => ((element.S == 0) && (element.I == 0) && (element.R == 0)))) {
  len = dataset.find(element => ((element.S == 0) && (element.I == 0) && (element.R == 0))).ind;
 } else {
  len = 1087;
 }

  var xScale = d3.scaleLinear()
    .domain([0, len]) // number of entries in each column of dataset 
    .range([0, width/2]); // 2.5 is for

  var yScale = d3.scaleLinear()
    .domain([0, 1000000])
    //.domain([0, series[0][0].data.S]) // S will have highest value since it can be tot pop
    .range([height-2*margin.bottom, margin.top])
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
    .attr("class", "left")
    .data(series)
    .enter().append("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .attr("class", "color")
      .attr("class", "left")

  // x axis
  svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + (height-2*margin.bottom) + ")")
    .call(d3.axisBottom(xScale)
      .tickPadding(10))
    .attr("class", "left");

  // y axis
  svg.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yScale))
    .attr("class", "right");


    // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/2)
      .attr("y", height-0.9*margin.bottom )
      .attr("class", "text")
      .text("Time elapsed");

  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0.7*margin.left)
      .attr("class", "text")
      .attr("y", 0.5*margin.top)
      .text("Total Population")
      .attr("text-anchor", "start")

    legend = svg.selectAll(".legend")                    
      .data(keys)
      .enter().append("g")
      .attr("transform", function(d, i) {      
        var hor = width/1.45 + i/1.3*margin.top;
        var ver = .75*margin.top;                         
        return "translate(" + hor + "," + ver + ")"; });    

  legend.append("rect")   
    .attr("class", "legend")                           
    .attr("width", legendRectSize)                  
    .attr("height", legendRectSize)                        
    .style("fill", function(d) { return color(d); })                          
    .style("stroke", function(d) { return color(d); });  

  legend.append("text")  
    .attr("class", "legend")                       
    .attr("x", legendRectSize/2)           
    .attr("y", -2*legendSpacing)              
    .text(function(d) { return d; }) // this d comes from the legend data
    .style("font-size", 20)
    .style("text-anchor", "middle");  

}


function ready1(data) {
  dataset = data[0];
  series = stack(data[0]);
  if (dataset.find(element => ((element.S == 0) && (element.I == 0) && (element.R == 0)))) {
  len = dataset.find(element => ((element.S == 0) && (element.I == 0) && (element.R == 0))).ind;
 } else {
  len = 1087;
 }

  var xScale = d3.scaleLinear()
    .domain([0, len]) // number of entries in each column of dataset 
    .range([1, width/2]); // 2.5 is for

  var yScale = d3.scaleLinear()
    .domain([0, 1000000])
    //.domain([0, series[0][0].data.S]) // S will have highest value since it can be tot pop
    .range([height-2*margin.bottom, margin.top])
    .nice();

    svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + (height-2*margin.bottom) + ")")
    .call(d3.axisBottom(xScale)
      .tickPadding(10))
    .attr("class", "left");

  // y axis
  svg.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yScale))
    .attr("class", "left");

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
    .attr("class", "left")
    .enter().append("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .attr("class", "color")
      .attr("class", "left")

}