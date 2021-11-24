import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { fetchHandler } from '../../../utils/fetchHandler';
import { API } from '../../../utils/API';
import * as d3 from 'd3';

import { bar_mock_data1, bar_mock_data2 } from '../../../utils/utility';



function BarChart(props) {

    const margin = {top: 40, right: 30, bottom: 20, left: 50};

    const { europeData, selectedCountriesData, selectedPeriod, selectedCountries } = useContext(Context);

    useEffect(() => {
        if(selectedCountries.length != 0){
            let data = {
                ...selectedPeriod,
                selectedCountries: selectedCountries
            }
            fetchHandler(data, API.METHOD.POST, API.GET_PEOPLE_VACCINATED, createBarData) 
        }
        else{
            drawChart([]); 
        }
    }, [europeData, selectedCountriesData]);

    function createBarData(selectedData) {
        console.log(selectedData)
        var resData = []
        selectedData.forEach(data => {
            var entryData = {}
            entryData["group"] = data.name;
            entryData["people_fully_vaccinated"] = Math.floor((data.people_fully_vaccinated * 100) / data.population);
            entryData["people_vaccinated"] = Math.floor((data.people_vaccinated * 100) / data.population) - entryData["people_fully_vaccinated"];
            resData.push(entryData);
        })

        console.log(resData)

        drawChart(resData);
    }

    var MyBarChart = {
        draw: function(id, data, cfg){
            d3.select(id).select("svg").remove();

            var colorscale = cfg.color;

            //console.log(data)

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
            // var groups = ["Italy", "France", "Germany"]
            var groups = d3.map(data, function(d){return(d.group)})
            //console.log(groups)

            // Add X axis
            var x = d3.scaleBand()
                .domain(groups)
                .range([0, cfg.w])
                .padding(0.4)
            svg.append("g")
                .attr("transform", "translate(0," + cfg.h + ")")
                .call(d3.axisBottom(x).tickSizeOuter(0));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 100])
                .range([ cfg.h, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y));

            //console.log(data)

            //stack the data? --> stack per subgroup
            var stackedData = d3.stack()
                .keys(subgroups)
                (data)
            
            //console.log(stackedData)

            // Show the bars
            svg.append("g")
                .selectAll("g")
                // Enter in the stack data = loop key per key = group per group
                .data(stackedData)
                .enter().append("g")
                .attr("fill", function(d, i) { return colorscale(i); })
                .selectAll("rect")
                // enter a second time = loop subgroup per subgroup to add all rectangles
                .data(function(d) { return d; })
                .enter().append("rect")
                    .attr("x", function(d) { return x(d.data.group); })
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                    .attr("width", x.bandwidth())

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
                .attr("x", 450) // cfg.w 
                .attr("y", 20) // cfg.h
                .attr("font-size", "15px")
                .attr("fill", "#404040")
                .text("Legend:");
                    
            if(LegendOptions != null){
                //Initiate Legend	
                var legend = svgl.append("g")
                    .attr("class", "legend")
                    .attr('transform', 'translate(90,-20)') ;
                
                //Create colour squares
                legend.selectAll('rect')
                .data(LegendOptions).enter()
                .append("rect")
                .attr("x", cfg.lw + 150)
                .attr("y", function(d, i){ return 70 + (i * 20);})
                .attr("id", function(d){return d})
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function(d, i){
                    console.log(i) 
                    return colorscale(i);
                })
                /*
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
                */
                ;
                

                //Create text next to squares
                legend.selectAll('text')
                    .data(LegendOptions).enter()
                    .append("text")
                    .attr("x", cfg.lw + 170)
                    .attr("y", function(d, i){ return 70 + (i * 20 + 9);})
                    .attr("font-size", "12px")
                    .attr("fill", "#737373")
                    .text(function(d) { return d });  
            }
        }  
    }

    function drawChart(data) {

        var cfg = {
            w: 500,
            h: 250,
            lw: 250,
            lh: 250,
            standard_opacity: 0.4,
            full_opacity: 0.8,
            color: d3.scaleOrdinal(d3.schemeCategory10)
        };
        if(data.length != 0){
            MyBarChart.draw("#bar_container", data, cfg);
        }
        else{
            MyBarChart.draw("#bar_container", bar_mock_data2, cfg);
        }
    }

    return <div id="bar_container" />;
}

export default BarChart;