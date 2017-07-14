 let results = [],
     chart,
     bars,
     margin = 100,
     w = 4,
     h = 500,
     x, y,
     xAxis, yAxis;

 d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, data) {
     data.data.forEach((item) => {
         let result = {};
         result.year = new Date(item[0]);
         result.value = item[1];
         results.push(result);
     });

     chart = d3.select('body').append('svg')
         .attr('class', 'chart')
         .attr('width', 1300)
         .attr('height', h)
         .append('g');

     d3.select('svg g')
         .attr('transform', 'translate(50, 50)');
     x = d3.time.scale()
         .domain([results[0].year, d3.time.year.offset(results[results.length - 1].year, 1)])
         .range([0, w * results.length])

     y = d3.scale.linear()
         .domain([0, d3.max(results, function(d) {
             return d.value;
         })])
         .rangeRound([0, h - margin]);

     // Bars
     bars = chart.append('g')
         .attr('class', 'bars');

     bars.selectAll('rect')
         .data(results)
         .enter().append('rect')
         .attr('x', function(d, i) {
             return x(d.year) - .5;
         })
         .attr('y', function(d) {
             return (h - margin) - y(d.value) + .5
         })
         .attr('width', w)
         .attr('height', function(d) {
             return y(d.value)
         })
         .append('g');

     // Axis
     xAxis = d3.svg.axis()
         .scale(x)
         .ticks(20)
         .tickSize(6, 3, 1);

     yAxis = d3.svg.axis()
         .scale(d3.scale.linear().domain([0, d3.max(results, function(d) {
             return d.value;
         })]).rangeRound([h - margin, 0]))
         .tickSize(6, 3, 1)
         .orient('right');

     chart.append('g')
         .attr('class', 'x axis')
         .attr('transform', 'translate(0, ' + (h - margin) + ')')
         .call(xAxis);

     chart.append('g')
         .attr('class', 'y axis')
         .attr('transform', 'translate(' + x.range()[1] + ')')
         .call(yAxis);
 });
