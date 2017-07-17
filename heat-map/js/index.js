// temperature data URL

var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

var months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

var colors = [
    '#7FFF00',
    '#00FF7F',
    '#FFFF00',
    '#FFA500',
    '#FF0000',
    '#DC143C'
];


var margin = {
	top: 5,
	right: 5,
	bottom: 50,
	left: 75
};

var width = 1000 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

d3.json(url, function(error, data) {

	var baseTemp = data.baseTemperature;

	var temps = data.monthlyVariance.map(function(obj) {
		return obj.variance;
	});

	var years = data.monthlyVariance.map(function(obj) {
		return obj.year;
	});

	years = years.filter(function(v, i) {
		return years.indexOf(v) == i;
	});

	var lowestTemp = d3.min(temps);
	var highestTemp = d3.max(temps);

	var lowestYear = d3.min(years);
	var highestYear = d3.max(years);

	var minDate = new Date(lowestYear, 0);
	var maxDate = new Date(highestYear, 0);

	var chartWidth = width / years.length;
	var chartHeight = height / months.length;

	var colorScale = d3.scale.quantile().domain([lowestTemp + baseTemp, highestTemp + baseTemp]).range(colors);

	var svg = d3
		.select('#chart')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var yLabels = svg
		.selectAll('.monthLabel')
		.data(months)
		.enter()
		.append('text')
		.text(function(d) {
			return d;
		})
		.attr('x', 0)
		.attr('y', function(d, i) {
			return i * chartHeight;
		})
		.style('text-anchor', 'end')
		.attr('transform', 'translate(-6,' + chartHeight / 1.5 + ')')
		.attr('class', 'monthLabel scales axis axis-months');

	var xLabels = d3.time.scale().domain([minDate, maxDate]).range([0, width]);

	var xAxis = d3.svg.axis().scale(xLabels).orient('bottom').ticks(d3.time.years, 10);

	svg.append('g').attr('class', 'axis axis-years').attr('transform', 'translate(0,' + (height + 1) + ')').call(xAxis);

	var temps = svg.selectAll('.years').data(data.monthlyVariance, function(d) {
		return d.year + ':' + d.month;
	});

	temps
		.enter()
		.append('rect')
		.attr('x', function(d) {
			return (d.year - lowestYear) * chartWidth;
		})
		.attr('y', function(d) {
			return (d.month - 1) * chartHeight;
		})
		.attr('rx', 0)
		.attr('ry', 0)
		.attr('width', chartWidth)
		.attr('height', chartHeight)
		.style('fill', 'white');

	temps.transition().duration(1000).style('fill', function(d) {
		return colorScale(d.variance + baseTemp);
	});
});