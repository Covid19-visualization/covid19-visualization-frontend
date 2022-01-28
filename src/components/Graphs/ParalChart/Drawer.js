/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import * as d3 from 'd3';
import "./ParalChart.css"

export const MyParalChart = {
    draw: function(id, data, cfg, countries){
        var domains = {"Pop density": [3, 19500], 
                    "Life Expect": [65, 90],  
                    "GDP per Capita": [5000, 945000], 
                    "Human Develop Idx": [0.5, 1], 
                    "Age": [37, 48], 
                    "Smokers": [0, 100], 
                    "Card death rate": [50, 550], 
                    "Diab preval": [3, 11]
                }

        d3.select(id).select("svg").remove();
        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 10, bottom: 10, left: 0}

        // append the svg object to the body of the page
        var svg = d3.select(id)
            .append("svg")
            //.style("background-color", "blue")
            .attr("width", cfg.w - 150)
            .attr("height", cfg.h + 90)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
        var dimensions = data[0].filter(function(d) { return d != "Countries" })

        // For each dimension, I build a linear scale. I store all in a y object
        var y = {}
        for (var i in dimensions) {
            var name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain( d3.extent(data, function(d) { return d[name]; }))
                //.domain(domains[name])
                .range([cfg.h + 50, 0])
        }

        // Build the X scale -> it find the best position for each Y axis
        var x = d3.scalePoint()
        .range([0, cfg.w - 110])
        .padding(1)
        .domain(dimensions);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function(p) { 
                return [x(p), y[p](d[p])]; 
            }));
        }

        // Draw the lines
        svg
        .selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("d",  path)
        .attr("id", function(c){
            var id = '';
            if(c["Countries"] != null)
                id = c["Countries"].replace(/\s/g, "")
            return "line"+id
        })
        .style("fill", "none")
        .style("stroke", function(c){return cfg.color[c["Countries"]]})
        .style("stroke-width", 3)
        .style("opacity", 1)

        // Draw the axis:
        svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // Add axis title
        .append("text")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-10)")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black")
    }
};

function rect(x, y, w, h) {
    return "M"+[x,y]+" l"+[w,0]+" l"+[0,h]+" l"+[-w,0]+"z";
}