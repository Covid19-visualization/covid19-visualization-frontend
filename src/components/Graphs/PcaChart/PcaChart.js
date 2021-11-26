

import React, { useContext, useEffect, useState } from 'react';
import * as d3 from 'd3'
import { Context } from '../../../context/Provider';
import { fetchHandler } from '../../../utils/fetchHandler';
import { API } from '../../../utils/API';
import {mock_pca_data, dbLabelDaily, dbLabelStatic, countriesNames} from '../../../utils/utility';
import "./PcaChart.css"

const kmeans = require('node-kmeans');
const PCA = require('pca-js')
const math = require('mathjs')


function PcaChart(props) {

    var pcaData;

    const margin = {top: 40, right: 10, bottom: 0, left: 70};

    const { selectedPeriod, europeData, selectedCountriesData, selectedCountries  } = useContext(Context);

    
    useEffect(() => { 
        if(selectedCountries.length != 0){
            let data = {
                ...selectedPeriod,
                selectedCountries: selectedCountries
            }
            fetchHandler(data, API.METHOD.POST, API.COMPUTE_PCA, createPcaData)
        }
        else{
            drawChart(false, 0); 
        }
    }, [europeData, selectedCountriesData]);

    function createPcaData(selectedData) {
        let pcaMatrix = []
        let countries = []
        console.log(selectedData)

        for(var i = 0; i < selectedData.length; i++){
            insertPcaEntries(selectedData[i], pcaMatrix, countries);
        }  

        //console.log(pcaMatrix)

        // Generate Eigen vectors
        var vectors = PCA.getEigenVectors(pcaMatrix);

        // Matrix of eigenvectors with the first two PCA (2D)
        var vectMat = math.matrix([vectors[0].vector, vectors[1].vector])

        var origMat = math.matrix(pcaMatrix)
        //console.log(origMat)
        
        // Dimensionality Reduction
        var resMat = math.multiply(origMat, math.transpose(vectMat))

        console.log(countries)

        pcaData = countries;

        for(var i = 0; i < selectedData.length; i++){
            updateCountryMatrix(countries[i], vectors);
        }  

        drawChart(true, countries);
        
        /*
        kmeans.clusterize(resMat._data, { k: 2 }, (err, result) => {
            if (err) console.error(err);
            else {
                pcaData = result;
                drawChart(true);
            }
        });
        */
        
    }

    function insertPcaEntries(selectedData, pcaMatrix, countries){
        let countryMatrix = [];
        let pcaEntry = [];
        for(var z = 0; z < selectedData.data.length; z++){
          for(var i = 0; i < dbLabelStatic.length; i++){
            pcaEntry.push(selectedData[dbLabelStatic[i]])
          }
          for(var j = 0; j < dbLabelDaily.length; j++){
            var value = selectedData.data[z][dbLabelDaily[j]]
            pcaEntry.push(value ? value : 0)
          }
          //console.log(pcaEntry)
          pcaMatrix.push(pcaEntry);
          countryMatrix.push(pcaEntry);
          pcaEntry = []
        }

        countries.push({"country": selectedData["name"], "pca" : countryMatrix});
      }

      function updateCountryMatrix(country, vectors){
        // Matrix of eigenvectors with the first two PCA (2D)
        var vectMat = math.matrix([vectors[0].vector, vectors[1].vector])

        var origMat = math.matrix(country.pca)
        //console.log(origMat)
        
        // Dimensionality Reduction
        var resMat = math.multiply(origMat, math.transpose(vectMat))

        country.pca = resMat._data
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
                .attr("x", 450) // cfg.w 
                .attr("y", 20) // cfg.h
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
                .attr("x", cfg.lw + 150)
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
                    .attr("x", cfg.lw + 170)
                    .attr("y", function(d, i){ return 70 + (i * 20 + 9);})
                    .attr("font-size", "12px")
                    .attr("fill", "#737373")
                    .text(function(d) { return d.country; });  
            }
        }
    }

    function drawChart(data, countries) {
        //Options for the Radar chart, other than default
        var cfg = {
            w: 1000,
            h: 400,
            lw: 250,
            lh: 250,
            color: d3.scaleOrdinal(d3.schemeCategory10)
        };
        if(data){
            MyPcaChart.draw("#pca_container", pcaData, countries, cfg);
        }
        else{
            MyPcaChart.draw("#pca_container", mock_pca_data, countries, cfg);
        }
        
    }
    return <div id="pca_container"/>;
}

export default PcaChart;
