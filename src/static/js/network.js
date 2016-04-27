

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var newResponse = JSON.parse(xmlhttp.responseText);
        return newResponse
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

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
        .attr("r", 8)
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
        var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

        d3.selectAll(".node")
        .on("mouseover", function(){
            tooltip.html(checkForEmptyOSMatches(this));
            return tooltip.style("visibility", "visible");})

        .on("mousemove", function(){
            return tooltip.style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px")
            .style("max-width","200px")
            .style("max-height","300px")
            .style("background-color", "rgba(0,0,0, 0.8)")
            .style("padding", "10px")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-color", "rgba(245,245,245,0.1)")
            .style("border-radius", "3px")
            .style("text-align", "center")
        })
        .on("mouseout", function(){
            return tooltip.style("visibility", "hidden")})

        .on("mousedown", function(d) {
            var idx = d3.select(d).node().index;
            var selection = d3.selectAll("circle")[0][idx];
                d3.select(selection).style("stroke-width", "2px").attr('r', 11);
            console.info(d3.select(selection))
            var colHeight = $('div.col-md-10').height() - 20;
            var info = d3.select('div.info');
            var circles = d3.select('div.circle-keys-inner');
            var infoFooter = d3.select('div.info-footer');
            var legend = d3.select('h6.legend');

            d3.select(selection).on("mouseup", function(d) {
                d3.select(selection).style("stroke", "white").attr('r', 8);
            })

            $('div.col-md-2').height(colHeight);
            // d3.select().style("stroke", "yellow");
            legend.text('network info');
            circles.style('visibility', 'hidden');
            info.style('visibility', 'visible');
            info.html(checkForEmptyServices(this));
            infoFooter.html("<a class='btn'>legend</a>");
            infoFooter.on("click", function() {
                if (legend.text() === 'network info') {
                    legend.text('Legend');
                    infoFooter.html("<a class='btn'>network info</a>");
                    circles.style('visibility', 'visible');
                    info.style('visibility', 'hidden');
                } else {
                    legend.text('network info');
                    infoFooter.html("<a class='btn'>legend</a>");
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
        var openPorts = [node.__data__.OpenPorts]
        var os_version = node.__data__.OSMatch

        var result = openPorts.map(function(ports) {

            }

        });

        console.info('result ', result)

        if (ports.length === 0) {       
            return "Host<a class='info'>" + name + "</a><p><p>IP<a class='info'>" + node.__data__.IP + "</a><p><p>" +  "<p> has no open ports.</p>";
        } else {
            return "Host<a class='info'>" + name + "</a><p><p>IP<a class='info'>" + node.__data__.IP + 
            "</a><p><p>Open Ports<a class='info'>" + openPorts.join(', ') + "</a></br>";
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