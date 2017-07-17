var url =
	"https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

d3.json(url, function(data) {
	var dater = data,
		nodes = data.nodes,
		links = data.links,
		margin = {
			top: 120,
			right: 10,
			bottom: 10,
			left: 10
		},
		chartHeight = 800,
		chartWidth = 800,
		graphHeight = chartHeight - margin.bottom - margin.top,
		graphWidth = chartWidth - margin.left - margin.right,
		//If you want to see an angular style {{data | json}} block add pre back to html
		json = d3.select("pre").text(JSON.stringify(dater, undefined, 4));

	function findCenter(element) {
		var center = +d3.select("#chart").attr("width") / 2;
		var elementCenter = element.getBBox().width / 2;
		return center - elementCenter;
	}

	var svg = d3
		.select("#chart")
		.attr("width", chartWidth)
		.attr("height", chartHeight);

	var force = d3.layout
		.force()
		.nodes(nodes)
		.links(links)
		.size([chartWidth, chartHeight])
		.linkStrength(0.1)
		.friction(0.9)
		.linkDistance(20)
		.charge(-30)
		.gravity(0.05)
		.theta(0.8)
		.alpha(0.1)
		.start();

	var link = svg
		.selectAll(".link")
		.data(links)
		.enter()
		.append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) {
			return Math.sqrt(d.value);
		});

	var flags = d3
		.select("#overlay")
		.selectAll(".node")
		.data(nodes)
		.enter()
		.append("img")
		.attr("class", function(d) {
			return "flag flag-" + d.code;
		})
		.on("mouseover", function(d) {
			var xPos = d3.select(this).style("left");
			var yPos = event.pageY - 950;
			var tooltip = d3
				.select("#tooltip")
				.style("left", parseInt(xPos, 10) - 60 + "px")
				.style("top", yPos + "px")
				.attr("class", "tips");

			d3.select("#country").text(d.country);
		})
		.on("mouseout", function() {
			d3.select("#tooltip").attr("class", "hidden");
		})
		.call(force.drag);

	force.on("tick", function() {
		link
			.attr("x1", function(d) {
				return d.source.x;
			})
			.attr("y1", function(d) {
				return d.source.y;
			})
			.attr("x2", function(d) {
				return d.target.x;
			})
			.attr("y2", function(d) {
				return d.target.y;
			});

		flags
			.style("left", function(d) {
				return d.x + "px";
			})
			.style("top", function(d) {
				return d.y - 3 + "px";
			});
	});

	var chartTitle = d3
		.select("#chart")
		.append("text")
		.text("Force Directed Graph of State Contiguity")
		.attr("font-size", "40px")
		.attr("font-family", "Helvetica")
		.attr("id", "chartTitle");

	chartTitle
		.attr("x", findCenter(document.getElementById("chartTitle")))
		.attr("y", 42);
});