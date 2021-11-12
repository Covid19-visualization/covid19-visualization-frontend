

import React, { useContext, useEffect, useState } from 'react';
import * as d3 from 'd3'
import { Context } from '../../../context/Provider';
import { fetchHandler } from '../../../utils/fetchHandler';
import { API } from '../../../utils/API';
import {mock_pca_data } from '../../../utils/utility';
import "./PcaChart.css"

const kmeans = require('node-kmeans');


function PcaChart(props) {

    var pcaData;

    const margin = {top: 70, right: 10, bottom: 0, left: 100};

    const { selectedPeriod, europeData, selectedCountriesData, selectedCountries  } = useContext(Context);

    
    useEffect(() => { 
        if(selectedCountries.length != 0){
            let data = {
                ...selectedPeriod,
                selectedCountries: selectedCountries
            }
            fetchHandler(data, API.METHOD.POST, API.COMPUTE_PCA, createPcaData)
            drawChart(true); 
        }
        else{
            drawChart(false); 
        }
    }, [europeData, selectedCountriesData]);

    function createPcaData(newData) {
        kmeans.clusterize(newData.data, { k: 2 }, (err, result) => {
            if (err) console.error(err);
            else {
                pcaData = result;
                console.log(result);
            }
        });
    }


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
                .domain([-100000000, 100000000])
                .range([ 0, 500 ]);

            svg.append("g")
                .attr("transform", "translate(0," + 250 + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([-100000000, 100000000])
                .range([ 250, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            // Add dots
            data.forEach(c => {
                svg.append('g')
                .selectAll("dot")
                .data(c.cluster).enter()
                .append("circle")
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
        }
    }

    function drawChart(data) {
        //Options for the Radar chart, other than default
        var cfg = {
            w: 1000,
            h: 400,
            color: d3.scaleOrdinal(d3.schemeCategory10)
        };
        if(data){
            setTimeout(function(){
                MyPcaChart.draw("#pca_container", pcaData, 0, cfg);
            }, 6000);
        }
        else{
            MyPcaChart.draw("#pca_container", mock_pca_data, 0, cfg);
        }
        
    }
    return <div id="pca_container"/>;
}

export default PcaChart;
