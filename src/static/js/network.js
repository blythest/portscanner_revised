	d3.json('static/json_dictionary.json', function(error, graph) {
	
	    var nodes = graph.nodes;
	    var links = graph.links;

	var height = $('div.d3container').height();
	var width = $('div.col-md-10').width();

	var svg = d3.select('div.col-md-10').append('svg')
	    .attr('width', width)
	    .attr('height', height)

	var force = d3.layout.force()
	    .size([width, height])
	    .nodes(nodes)
	    .links(links);

	force.linkDistance(width/3);

	function tick() {
	    link.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });


	    node.attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; });
	    // node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	    };4

	function checkForEmptyServices(node) {

	/*
	* Takes in the D3 HTML object in the format:
	* <circle class="node" r="7" name="64:5A:04:87:30:0E portService="netbiOSssn"
	* fill = "aliceblue" cx="277.707" cy="207.75" style="fill:#537897;"></circle>
	* returns a string of text.  
	*/

	var name = node.__data__.Id
	var ports = node.__data__.PortServices

	var os_version = node.__data__.OSMatch

	// var os = node._data_.OSMatch

	if (ports.length === 0) {       
	return "host " + name + "</div> " + "<p>" +  "<p> has no open ports.</p>";
	} else {
	console.log(ports);
	return "host " + "<div style='background-color: yellow; padding-left: 2px'>" + name + "</div> " + "<p> is running " + "<b>" + ports.join(', ') + "<b></p>";
	}
	};

	function checkForEmptyOSMatches(node) {

	/*
	* Takes in the D3 HTML object in the format:
	* <circle class="node" r="7" name="64:5A:04:87:30:0E portService="netbiOSssn"
	* fill = "aliceblue" cx="277.707" cy="207.75" style="fill:#537897;"></circle>
	* returns a string of text.  
	*/

	var name = node.__data__.name
	var os_version = node.__data__.OSMatch
	// var os = node._data_.OSMatch

	if (os_version === "") {        
	return "<p>OS Version unavailable.</p>";
	} else {
	return "<p>" + os_version + "</p>";
	}
	};

	var tooltip = d3.select('div.col-md-10')
	    .append('div')
	    .style('position', 'absolute')
	    .style('z-index', '10')
	    .style('visibility', 'hidden')

	var link = svg.selectAll('.link')
	    .data(graph.links)
	    .enter().append('line')
	    .attr('class', 'link')
	    .style('stroke-width', 1)

	var node = svg.selectAll('.node')
	    .data(nodes)
	    .enter().append('circle')
	    .attr('class', 'node')
	    .attr('PortService', function(d) {
	        return d.PortServices;
	    })
	    .style('fill', function(d) { 
	        if (d.group === 1) {
	            return '#E1B594';
	            };
	        if (d.group === 2) {
	            return '#FF2B1A';
	            };
	        if (d.group === 3) {
	            return '#E1B594';
	            };
	        if (d.group === 4) {
	            return '#20B8FE';

	            };
	        if (d.group === 5) {
	            return '#271192';
	            };
	        })
	        
	    .on("mouseover", function() {
	        tooltip.html(checkForEmptyOSMatches(this))
	        $('div.info').append("text").html(checkForEmptyServices(this))
	            return tooltip.style("visibility", "visible");
	        })

	    .on("mousemove", function(){
	        console.info('event.pageY ', event.pageY);
	        console.info('event.pageX ', event.pageX);
	        return tooltip.style("top", (event.pageY)+"px")
	        .style("left",(event.pageX)+"px")
	        .style("max-width","200px")
	        .style("max-height","300px")
	        .style("background-color", "rgba(163, 224, 255, 0.9)")
	        .style("padding", "10px")
	        .style("border-style", "solid")
	        .style("border-color", "fff")
	        .style("border-width", "1px")
	        .style("border-radius", ".3em")
	        .style("text-align", "center");})
	    .on("mouseout", function(){
	        return tooltip.style("visibility", "hidden"),
	        servicesBox.html(" ")
	    })

	force.on('end', function() {
	    node.attr('r', 7)
	    .attr('cx', function(d) { return d.x; })
	    .attr('cy', function(d) { return d.y; });

	link.attr('x1', function(d) { return d.source.x; })
	    .attr('y1', function(d) { return d.source.y; })
	    .attr('x2', function(d) { return d.target.x; })
	    .attr('y2', function(d) { return d.target.y; });

	});

	force.start();
});