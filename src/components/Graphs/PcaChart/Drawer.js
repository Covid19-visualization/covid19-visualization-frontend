/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import * as d3 from 'd3';
import "./PcaChart.css"

export const MyPcaChart = {
    draw: function(id, data, legendOptions, cfg){
        const margin = {top: 40, right: 10, bottom: 0, left: 70};
        var series = 0;

        d3.select(id).select("svg").remove();

        // append the svg object to the body of the page
        var svg = d3.select(id)
                    .append("svg")
                    .attr("width", cfg.w)
                    .attr("height", cfg.h)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

        //Tooltip
        var tooltip = svg.append('text')
                .style('opacity', 0)
                .style('font-family', 'sans-serif')
                .style('font-size', '13px');

        // Add X axis
        var x = d3.scaleLinear()
            .domain([cfg.min_x, cfg.max_x])
            .range([ 0, 500 ]);

        svg.append("g")
            .attr("transform", "translate(0," + 250 + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([cfg.min_y, cfg.max_y])
            .range([ 250, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // Add dots
        data.forEach(c => {
            svg.append('g')
            .selectAll("dot")
            .data(c.pca).enter()
            .append("circle")
            .attr("id", (c.country).replace(/\s/g, ""))
            .attr("valuex", function (d) { return d[0] } )
            .attr("valuey", function (d) { return d[1] } )
            .attr("cx", function (d) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 3)
            .style("fill", cfg.color(series))

            .on('mouseover', function (d){
                d3.select(this).attr("r", 6)
                tooltip
                    .attr('x', parseFloat(d3.select(this).attr('cx')) + 10)
                    .attr('y', parseFloat(d3.select(this).attr('cy')))
                    .text("("+d3.select(this).attr("valuex") + ", " + d3.select(this).attr("valuey")+")")
                    .transition(200)
                    .style('opacity', 1);
        
            })
            .on('mouseout', function(){ 
                d3.select(this).attr("r", 3) 
                tooltip
                    .transition(200)
                    .style('opacity', 0);
            
            });
            series++;
        });
        series = 0;


        
        ////////////////////////////////////////////
        /////////////// LEGEND /////////////////////
        ////////////////////////////////////////////

        
        var colorscale = cfg.color;

        //Legend titles
        var LegendOptions = legendOptions;

        var svgl = d3.select(id)
        .selectAll('svg')
        .append('g')
        .attr("width", cfg.lw)
        .attr("height", cfg.lh)

        //Create the title for the legend
        var text = svgl.append("text")
            .attr("class", "title")
            .attr('transform', 'translate(90,10)') 
            .attr("x", 480)
            .attr("y", 20)
            .attr("font-size", "15px")
            .attr("fill", "#404040")
            .text("Selected:");
                
        if(LegendOptions != null){
            //Initiate Legend	
            var legend = svgl.append("g")
                .attr("class", "legend")
                .attr('transform', 'translate(90,-20)') ;
            
            //Create colour squares
            legend.selectAll('rect')
            .data(LegendOptions).enter()
            .append("rect")
            .attr("x", cfg.lw + 230)
            .attr("y", function(d, i){ return 70 + (i * 20);})
            .attr("id", function(d){return (d.country).replace(/\s/g, "");})
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d, i){ return colorscale(i);})
            .on('mouseover', function (c){
                var id = d3.select(this).attr('id')
                var z = "circle#"+id;
                svg.selectAll("circle")
                .transition(200)
                .style("fill-opacity", 0); 
                svg.selectAll(z)
                .transition(200)
                .style("fill-opacity", 1);
            })
            .on('mouseout', function(){
                svg.selectAll("circle")
                .transition(200)
                .style("fill-opacity", 1);
            });
            ;
            

            //Create text next to squares
            legend.selectAll('text')
                .data(LegendOptions).enter()
                .append("text")
                .attr("x", cfg.lw + 250)
                .attr("y", function(d, i){ return 70 + (i * 20 + 9);})
                .attr("font-size", "12px")
                .attr("fill", "#737373")
                .text(function(d) { return d.country; });  
        }
        
    }
}