/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import * as d3 from 'd3';
import './BarChart.css';

export const MyBarChart = {
    draw: function(id, data, cfg){
        d3.select(id).select("svg").remove();

        const margin = {top: 10, right: 30, bottom: 20, left: 50};
        const tooltip = d3.select("#tooltipbarchart");
        var tooltipText = "";

        // append the svg object to the body of the page
        var svg = d3.select(id)
        .append("svg")
        .attr("width", cfg.w*2 + margin.left + margin.right)
        .attr("height", cfg.h + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
                
        // List of subgroups = header of the csv files = soil condition here
        var subgroups = ["people_fully_vaccinated", "people_vaccinated"];

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function(d){return(d.group)})

        
        ///////// Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, cfg.w])
            .padding(0.4)
        svg.append("g")
            .attr("transform", "translate(0," + cfg.h + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        ////////// Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([ cfg.h, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        ////////// Stack the data --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)
        
        ////////// Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d, i) { return cfg.colorSelection[i]; })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("id", function(d) {
                    var idx = d.data.group.replace(/\s/g, "")
                    return `rect${idx}`; 
                })
                .attr("x", function(d) { return x(d.data.group); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth())
                .attr("text", function(d) {return d[1]})

                .on('mouseover', function (event, d){
                    tooltipText = `<h3 style='color: ${cfg.color[d.data.group]}'>${d.data.group}</h3>` + 
                    `<a style='color: ${cfg.colorSelection[1]}'">People with <b>1 dose</b> of vaccine: </a>${d.data.people_fully_vaccinated + d.data.people_vaccinated}%` +
                    "<br>" + 
                    `<a style='color: ${cfg.colorSelection[0]}'">People with <b>2 doses</b> of vaccine: </a>${d.data.people_fully_vaccinated}%`;

                    const mousePosition = d3.pointer(event);

                    var X = mousePosition[0] + 830
                    var Y = mousePosition[1] + 480

                    tooltip.style("transform", `translate(calc( -50% + ${X}px), calc(-100% + ${Y}px))`)
                    tooltip.select("#value").html(tooltipText);
                    tooltip
                        .style('opacity', 1)
                })

                .on('mouseout', function(){
                    tooltip
                        .style('opacity', 0)
                })

        ////////////////////////////////////////////
        /////////////// LEGEND /////////////////////
        ////////////////////////////////////////////

        //Legend titles
        var LegendOptions = ["2 doses", "1 dose"];

        var svgl = d3.select(id)
        .selectAll('svg')
        .append('g')
        .attr("width", cfg.lw)
        .attr("height", cfg.lh)

        //Create the title for the legend
        var text = svgl.append("text")
            .attr("class", "title")
            .attr('transform', 'translate(90,10)') 
            .attr("x", 460) // cfg.w 
            .attr("y", 20) // cfg.h
            .attr("font-size", "15px")
            .attr("fill", "#404040")
            .text("Vaccinated with:");
                
        if(LegendOptions != null){
            //Initiate Legend	
            var legend = svgl.append("g")
                .attr("class", "legend")
                .attr('transform', 'translate(90,-20)') ;
            
            //Create colour squares
            legend.selectAll('circle')
            .data(LegendOptions).enter()
            .append("circle")
            .attr("cx", cfg.lw + 220)
            .attr("cy", function(d, i){ return 75 + (i * 20);})
            .attr("id", function(d){return d})
            .attr("r", 5)
            .style("fill", function(d, i){ return cfg.colorSelection[i]; });
        
            //Create text next to squares
            legend.selectAll('text')
                .data(LegendOptions).enter()
                .append("text")
                .attr("x", cfg.lw + 230)
                .attr("y", function(d, i){ return 70 + (i * 20 + 9);})
                .attr("font-size", "12px")
                .attr("fill", "#737373")
                .text(function(d) { return d });  
        }
    }  
}