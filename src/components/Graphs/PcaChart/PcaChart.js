
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {mock_pca_data } from '../../../utils/utility';


function PcaChart(props) {

    const d = props.data;

    const margin = {top: 30, right: 70, bottom: 0, left: 100};
    
    /*
    useEffect(() => { 
        drawChart(europeData, selectedCountriesData); 
    }, [europeData, selectedCountriesData]);
    */

    useEffect(() => { 
        drawChart(); 
    });


    var MyPcaChart = {
        draw: function(id, data, legendOptions, cfg){
            // append the svg object to the body of the page

            var series = 0;

            d3.select(id).select("svg").remove();

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
                .domain([0, 1000])
                .range([ 0, 500 ]);

            svg.append("g")
                .attr("transform", "translate(0," + 300 + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 1000])
                .range([ 300, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            // Add dots
            data.forEach(c => {
                svg.append('g')
                .selectAll("dot")
                .data(c).enter()
                .append("circle")
                .attr("valuex", function (d) { return d.v1 } )
                .attr("valuey", function (d) { return d.v2 } )
                .attr("cx", function (d) { return x(d.v1); } )
                .attr("cy", function (d) { return y(d.v2); } )
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
        }
    }

    function drawChart() {
        //Options for the Radar chart, other than default
        var cfg = {
            w: 1000,
            h: 370,
            color: d3.scaleOrdinal(d3.schemeCategory10)
        };

        MyPcaChart.draw("#pca_container", mock_pca_data, 0, cfg);
        
        /*
        if(data.radarData != null && data.radarData.length != 0){
            var radarData = generateRadarData(data.radarData[0], type);
            var legendOptions = generateLegendOptions(data.radarData[0])
            MyRadarChart.draw("#container2", radarData, legendOptions, cfg, data.radarData[0]);
        }
        else{
            if(type == CONST.CHART_TYPE.VACCINATIONS)
                MyRadarChart.draw("#container2", mock_data2_vacs, legendOptions, cfg, 0);
            else
                MyRadarChart.draw("#container2", mock_data2_cases, legendOptions, cfg, 0);
        }
        */
    }
    return <div class="card" id="pca_container"/>;
}

export default PcaChart;
