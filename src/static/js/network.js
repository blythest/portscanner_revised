
d3.json("static/json_dictionary.json", function(error, graph) {

    var height = $('div.d3container').height(),
        width = $('div.col-md-10').width();

    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(width/3);

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var svg = d3.select("div.col-md-10").append("svg")
        .attr('width', width)
        .attr('height', height);


    var link = svg.selectAll(".link")
        .data(graph.links)
    .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", "1px");

    var node = svg.selectAll("g.node")
        .data(graph.nodes)
    .enter().append("svg:g").append("circle")
        .style("stroke", "white")
        .style("stroke-width", "2px")
        .attr("class", "node")
        .attr("r", 7)
        .attr("name", function(d) {
            return d.name;
        })

        .attr("PortService", function(d) {
            return d.PortServices;
        })
        .style("fill", function(d) { 
            if (d.group === 1) {
                return "#31984D";
                };
            if (d.group === 2) {
                return "#FF2B1A";
                };
            if (d.group === 3) {
                return "#E1B594";
                };
            if (d.group === 4) {
                return "#20B8FE";

                };
            if (d.group === 5) {
                return "#C300FF";
                }
            })
        .on("mousedown", function() {
            var colHeight = $('div.col-md-10').height() - 20;
            var info = d3.select('div.info');
            var circles = d3.select('div.circle-keys-inner');
            var infoFooter = d3.select('div.info-footer').style('font-size', '16px');
            var legend = d3.select('h6.legend');

            $('div.col-md-2').height(colHeight);
            legend.text('network info');
            circles.style('visibility', 'hidden');
            info.style('visibility', 'visible');
            info.html(checkForEmptyServices(this));
            infoFooter.html('<a>legend</a>');

            infoFooter.on("click", function() {
                if (legend.text() === 'network info') {
                    legend.text('Legend');
                    infoFooter.html('<a>network info</a>');
                    circles.style('visibility', 'visible');
                    info.style('visibility', 'hidden');
                } else {
                    legend.text('network info');
                    infoFooter.html('<a>legend</a>');
                    circles.style('visibility', 'hidden');
                    info.style('visibility', 'visible');

                }

            }); 
    });

    force.on("tick", tick);

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });


        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
            // node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function checkForEmptyServices(node) {
        var name = node.__data__.Id
        var ports = node.__data__.PortServices

        var os_version = node.__data__.OSMatch

        // var os = node._data_.OSMatch

        if (ports.length === 0) {       
            return "host" + name + " " + "<p>" +  "<p> has no open ports.</p>";
        } else {
            console.log(ports);
            return "host " + name + " " + "<p> is running " + "<b>" + ports.join(', ') + "<b></p>";
        }
    };

    function checkForEmptyOSMatches(node) {
        var name = node.__data__.name
        var os_version = node.__data__.OSMatch
        // var os = node._data_.OSMatch

        if (os_version === "") {        
            return "<p>OS Version unavailable.</p>";
        } else {
            return "<p>" + os_version + "</p>";
        }
    };
});