var width = 1000;
var height = 450;
var projection = d3.geo.mercator().center([-2, 5]).scale(150).rotate([-180, 0]);
var svg = d3
    .select(".svg-con")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path().projection(projection);

var g = svg.append("g");
var gCircle = svg.append("g");

var dataSet = {};
var allStone = [];
var stoneScale = d3.scale.linear();
var $moreInfo = d3.select(".map");

// load and display the World
d3.json(
    "https://gist.githubusercontent.com/d3noob/5193723/raw/world-110m2.json",
    function(error, topology) {
        g
            .selectAll("path")
            .data(topojson.object(topology, topology.objects.countries).geometries)
            .enter()
            .append("path")
            .attr("fill", "#95E1D3")
            .attr("stroke", "#266D98")
            .attr("d", path);

        visualiseCircle();
    }
);

function aboutToGetRelativeSize() {
    dataSet.features.forEach(function(value) {
        var num = Number(value.properties.mass);
        allStone.push(num);
    });
    stoneScale.domain([d3.min(allStone), d3.max(allStone)]).range([1, 10]);
}

function visualiseCircle() {
    d3.json(
        "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json",
        function(err, data) {
            dataSet = data;
            aboutToGetRelativeSize();

            g
                .selectAll("circle")
                .data(data.features)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return projection([d.properties.reclong, d.properties.reclat])[0];
                })
                .attr("cy", function(d) {
                    return projection([d.properties.reclong, d.properties.reclat])[1];
                })
                .attr("r", function(d) {

                    var stone = d.properties;
                    if (stone.mass > 20000) return 13;
                    if (stone.mass > 15000) return 10;
                    if (stone.mass > 10000) return 8;
                    if (stone.mass > 5000) return 5;
                    return 3;
                })
                .attr("fill", function(d) {
                    var stone = d.properties;
                    if (stone.mass > 20000) return "#9c27b0";
                    if (stone.mass > 15000) return "#2196f3";
                    if (stone.mass > 10000) return "#ff9800";
                    if (stone.mass > 5000) return "#8bc34a";
                    return "#009688";
                })
                .attr("fill-opacity", 0.5)
                .attr("stroke", "rgb(234, 255, 208)")
                .attr("stroke-width", 1);

            // Hover affect
            g
                .selectAll("circle")
                .on("mouseover", function(d) {
                    $moreInfo
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY - 50 + "px");

                    d3.select(".map").style("display", "inline-block");
                    d3.select(".name").text(d.properties.name);
                    var year = d.properties.year.slice(0, 4);
                    d3.select(".year-fell").text(year);
                    d3.select(".mass").text(d.properties.mass);
                })
                .on("mouseout", function(d) {
                    d3.select(".map").style("display", "none");
                });
        }
    );
}