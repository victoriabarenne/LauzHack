var dataset = {}; // will store the SIR dataset
var SIR = {}; // stores the columns S, I, R

var margin = {top: 100, right: 15, bottom: 100, left: 50}
  //, width = parent.innerWidth - 2*margin.left - 2*margin.right
  , width = document.getElementById("vis").clientWidth - 2*margin.left - 2*margin.right
  , height = parent.innerHeight - 2*margin.top - 2*margin.bottom;
var legendRectSize = 18;
var legendSpacing = 4;

//make space for the graph plot
    //var selection = +d3select('#vis').style("width").slice(0,-2);
    //width = selection[0][0].clientWidth;

// make space for the graph plot 
var svg = d3.select("#vis").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("transform", "translate(" + (margin.left/2) +  ", 0)")
	.append("g")
	.attr("transform", "translate(" + 1.5*margin.left + "," + (margin.top/2) + ")");

// second svg for the bar plot in the original question (coming after the line graph)
// var barsvg = d3.select("#vis").append("svg")
// 		.attr("width", width + margin.left + margin.right)
// 		.attr("height", height + margin.top + margin.bottom)
// 		.attr("transform", "translate(" + (margin.left/2) + ", 0)") // translation to make room for axis label
// 	.append("g")
// 		.attr("transform", "translate(" + 2*margin.left + "," + (margin.top/2) + ")");

d3.dsv(",", "https://raw.githubusercontent.com/victoriabarenne/LauzHack/master/Basis_HTML/resultat.csv", function(d, i) {
	return { // day will be accessed via index 
		ind: +i, // convert string to index
		S: +d.S, // convert string to float
		I: +d.I, // convert string to float
		R: +d.R, // convert string to float 
	}
}).then(function(data) {
	dataset = data; // storing S, I, R in global variable dataset

	var xScale = d3.scaleLinear()
		.domain([0, dataset.length]) // number of entries in the dataset 
		.range([0, width-2.5*margin.right])
		.nice(); // 2.5 is for

	var yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset.map(dataset => dataset.S))]) // S will have highest value since it can be tot pop
		.range([height, margin.top/2])
		.nice();

	// append x axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale));

	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale));

	var line = d3.line() 
		.x(function(d) { return xScale(parseInt(d.ind)); })
		.y(function(d) { return yScale(parseFloat(d["S"])); });

	svg.append("path")
		.datum(dataset)
		.attr("class", "line")
		.attr("d", line)
		//.style("stroke", "steelblue"); 
		.style("stroke", "steelblue"); 

	svg.append("path")
		.datum(dataset)
		.attr("class", "line")
		.attr("d", line)
		.style("stroke", "steelblue");

})
