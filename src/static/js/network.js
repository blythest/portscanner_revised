var xhr = d3.xhr("/static/json_dictionary.json");

var res = xhr.response(function(request) {
    'use strict';
    return JSON.parse(request.responseText);
});

function draw() {
	'use strict';
    xhr.get(function(error, nodeGraph){
    var graph = nodeGraph[0];
    var height = $('div.d3container').height() + 100;
    var width = $('div.col-md-12').width();
    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(width/4);

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var svg = d3.select("div.col-md-12").append("svg")
            .attr('width', width)
            .attr('height', height);

        var node_drag = d3.behavior.drag()
            .on("dragstart", dragstart)
            .on("drag", dragmove)
            .on("dragend", dragend);

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
            .attr("name", function(d){
                return d.name;
            })
            .attr("PortService", function(d){
                return d.PortServices;
            })
            .style("fill", function(d){
                if (d.group === 1) {
                    return "#31984D";
                }
                if (d.group === 2) {
                    return "#FF2B1A";
                }
                if (d.group === 3) {
                    return "#E1B594";
                }
                if (d.group === 4) {
                    return "#20B8FE";
                }
                if (d.group === 5) {
                    return "#C300FF";
                    }
                })
            .call(node_drag);

            var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("font-family", "Maison Mono Light")
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
                .style("text-align", "center");})

            .on("mouseout", function(){
                return tooltip.style("visibility", "hidden");})

            .on("mousedown", function(d) {
                d3.selectAll('.openPorts').remove()
                d3.selectAll('.hostInfo').remove()
                d3.selectAll('.key').selectAll('.full-circle').remove()
                d3.selectAll('.footer.btn').remove()
                
                var idx = d3.select(d).node().index;
                var selection = d3.selectAll("circle")[0][idx];
                d3.select(selection).style("stroke", "#A6FFC7");
                var colHeight = $('div.col-md-12').height();
                var info = d3.select('div.info').style('height:200px')
                var legend = d3.select('h6.legend');
                var footerBtn = d3.select('footer.btn')

                d3.select(selection).on("mouseleave", function(d){
                    d3.select(selection).style("stroke", "white");
                });

                $('div.col-md-2').height(colHeight);
                legend.text('host info')
                checkForEmptyServices(selection)
                getHostInfo(selection)
                createFooterBtn(selection)
            })

            function tick() {
                link.transition().ease('linear').duration(400)
                    .attr("x1", function(d) { return d.source.x = Math.max(8, Math.min(width - 8, d.source.x)); })
                    .attr("y1", function(d) { return d.source.y = Math.max(8, Math.min(height - 8, d.source.y)); })
                    .attr("x2", function(d) { return d.target.x = Math.max(8, Math.min(width - 8, d.target.x)); })
                    .attr("y2", function(d) { return d.target.y = Math.max(8, Math.min(height - 8, d.target.y)); });

                node.transition().ease('linear').duration(400)
                    .attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 8, d.x)); })
                    .attr("cy", function(d) { return d.y = Math.max(8, Math.min(height - 8, d.y)); });
            // node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            }
            
            force.on("tick", tick)

            function redrawColorkey() {
                var colorData = {'Linux':'#FF2B1A', 'Mac OS X':'#31984D','iPhone':'#20B8FE', 'Unknown/ Other':'#C300FF'};
                d3.selectAll('div.key').selectAll('div.content.full-circle')
                    .data(d3.entries(colorData))
                    .enter()
                    .append('div')
                    .attr('class', 'full-circle')
                    .style('background-color', function(d) { return d.value})
                    .html(function(d) {
                        return "<p class='margin3 width2'>" + d.key + "</p>"
                    })

            }

            function createFooterBtn(selection){

                var openPorts = d3.selectAll('.openPorts')
                var hostInfo = d3.selectAll('.openPorts')
                d3.selectAll('div.content').append('div')
                    .attr('class', 'footer btn')
                    .text('legend')
                    .style('position', 'absolute')
                    .style('text-transform', 'uppercase')
                    .on('click', function() {
                        if (d3.select('h6.legend').text() === 'host info') {
                            d3.select(this).text('host info')
                            d3.select('h6.legend').text('legend')
                            d3.selectAll('.openPorts').remove()
                            d3.selectAll('.hostInfo').remove()
                            redrawColorkey()
      
                        } else {
                            d3.select(this).text('legend')
                            d3.select('h6.legend').text('host info')
                            checkForEmptyServices(selection)
                            getHostInfo(selection)
                            d3.selectAll('.full-circle').remove()

                            }
                            
                        })
                    }

            function getHostInfo(node) {
                var ip = node.__data__.IP;
                var id = node.__data__.Id;

                var hostInfo = {'IP': ip, 'ID': id}

                return d3.select("body").selectAll("div.host").html("<p class='sub-hed-mono hostInfo'>HOSTS</p>")
                	.selectAll("div.hostInfo")
                	.data(d3.entries(hostInfo))
                	.enter()
                	.append('div')
                	.attr('class', 'hostInfo host')
                	.html(function(d) { return "<p class='width2'>" + d.key + "<a> " + d.value + "</a>"})
            }
        
            function checkForEmptyServices(node) {
                var name = node.__data__.Id;
                var ports = node.__data__.portsMap
    
                if (d3.keys(ports).length === 0) {
                    return d3.select("body").selectAll("div.network")
                        .html("<p class='sub-hed-mono openPorts'>OPEN PORTS No open ports.</p>")

                }
                return d3.select("body").selectAll("div.network").html("<p class='sub-hed-mono openPorts'>OPEN PORTS</p>")
                	.selectAll("div.openPorts")
                    .data(d3.entries(ports))
                    .enter()
                    .append("div")
                    .attr("class", "openPorts network")
                    .html(function(d) { return "<p class='width2'>" + d.key + "<a> " + d.value + "</a>"})
                }

            function dragstart(d, i) {
                force.stop(); // stops the force auto positioning before you start dragging
            }

            function dragmove(d, i) {
                d.px += d3.event.dx;
                d.py += d3.event.dy;
                d.x += d3.event.dx;
                d.y += d3.event.dy; 
                tick(); // this is the key to make it work together with updating both px,py,x,y on d !
            }

            function dragend(d, i) {
                d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
                tick();
                force.resume();
            }

            function checkForEmptyOSMatches(node) {
                var name = node.__data__.name
                var os_version = node.__data__.OSMatch
                if (os_version === "") {        
                    return "<p>OS Version unavailable.</p>";
                } else {
                    return "<p>" + os_version + "</p>";
            }
        }
    }); }
draw();