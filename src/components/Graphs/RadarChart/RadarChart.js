import React, { useContext, useEffect, useState } from 'react';
import * as d3 from 'd3'
import { Context } from '../../../context/Provider';
import { refreshData, differenceBetweenDays, mock_data2 } from '../../../utils/utility';
import { CONST } from '../../../utils/const';
import { fetchHandler } from '../../../utils/fetchHandler';
import { API } from '../../../utils/API';

function RadarChart(props) {

    const {type} = props;

    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    
    const { europeData, selectedCountriesData, selectedPeriod } = useContext(Context);
    
    useEffect(() => { 
        //var europeFiltered = type == CONST.CHART_TYPE.VACCINATIONS ? europeData.vaccinations : europeData.cases;
        //var selectedCountriesFiltered = type == CONST.CHART_TYPE.VACCINATIONS ? selectedCountriesData.vaccinations : selectedCountriesData.cases;
        drawChart(europeData, selectedCountriesData); 
    }, [europeData, selectedCountriesData])
    

    var MyRadarChart = {
        draw: function(id, d, legendOptions, cfg){

            var allAxis = (d[0].map(function(i, j){return i.axis}));
            var total = allAxis.length;
            var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
            //var Format = d3.format('%');
            var Format = d3.format('.4');
            d3.select(id).select("svg").remove();
            
            var g = d3.select(id)
                    .append("svg")
                    .attr("width", cfg.w + margin.left + margin.right)
                    .attr("height", cfg.h+ margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);
                    ;

            var tooltip;
            
            //Circular segments
            for(var j=0; j<cfg.levels; j++){
                var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
                g.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
                .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
            }

            //Text indicating at what % each level is
            for(var j=0; j<cfg.levels; j++){
                var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
                g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
                .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
                .attr("fill", "#737373")
                .text(Format((j+1)*cfg.maxValue/cfg.levels));
            }
            
            var series = 0;

            var axis = g.selectAll(".axis")
                    .data(allAxis)
                    .enter()
                    .append("g")
                    .attr("class", "axis");

            axis.append("line")
                .attr("x1", cfg.w/2)
                .attr("y1", cfg.h/2)
                .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-width", "1px");

            axis.append("text")
                .attr("class", "legend")
                .text(function(d){return d})
                .style("font-family", "sans-serif")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .attr("dy", "1.5em")
                .attr("transform", function(d, i){return "translate(0, -10)"})
                .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
                .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

            var dataValues = [];
            d.forEach(function(y, x){
            g.selectAll(".nodes")
                .data(y, function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                });

            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie"+series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                })
                .style("fill", function(j, i){return cfg.color(series)})
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d){
                    var z = "polygon."+d3.select(this).attr("class");
                    g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", 0.1); 
                    g.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", .7);
                })
                .on('mouseout', function(){
                    g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", cfg.opacityArea);
                });
            series++;
            });
            series=0;


            d.forEach(y => {
                console.log(g)
                g.selectAll(".nodes")
                    .data(y).enter()
                    .append("svg:circle")
                    .attr("class", "radar-chart-serie"+series)
                    .attr('r', cfg.radius)
                    .attr("alt", function(j){return Math.max(j.value, 0)})
                    .attr("cx", function(j, i){
                        dataValues.push([
                            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                        ]);
                        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                    })
                    .attr("cy", function(j, i){
                        return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                    })
                    .attr("data-id", function(j){return j.axis})
                    .style("fill", cfg.color(series)).style("fill-opacity", .9)
                    .on('mouseover', function(data){
                        var newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                        var newY =  parseFloat(d3.select(this).attr('cy')) - 5;

                        tooltip
                            .attr('x', newX)
                            .attr('y', newY)
                            .text(Format(d3.select(this).select("title").text()))
                            .transition(200)
                            .style('opacity', 1);
                            
                        var z = "polygon."+d3.select(this).attr("class");
                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", .4); 
                        g.selectAll(z)
                            .transition(200)
                            .style("fill-opacity", .7);
                    })
                    .on('mouseout', function(){
                        tooltip
                            .transition(200)
                            .style('opacity', 0);
                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", cfg.opacityArea);
                    })
                    .append("svg:title")
                    .text(function(j){return Math.max(j.value, 0)});

                series++;
            });
            //Tooltip
            tooltip = g.append('text')
                    .style('opacity', 0)
                    .style('font-family', 'sans-serif')
                    .style('font-size', '13px');
            

            /*
            ////////////////////////////////////////////
            /////////// Initiate legend ////////////////
            ////////////////////////////////////////////

            
            var colorscale = d3.scaleOrdinal().range(["#EDC951","#CC333F","#00A0B0"]);

            //Legend titles
            var LegendOptions = ['Smartphone','Tablet'];

            var svg = d3.select('#container2')
            .selectAll('svg')
            .append('svg')
            .attr("width", cfg.w)
            .attr("height", cfg.h)

            //Create the title for the legend
            var text = svg.append("text")
                .attr("class", "title")
                .attr('transform', 'translate(90,0)') 
                .attr("x", 400) // cfg.w 
                .attr("y", 100) // cfg.h
                .attr("font-size", "12px")
                .attr("fill", "#404040")
                .text("States Selected");
                    
            //Initiate Legend	
            var legend = svg.append("g")
                .attr("class", "legend")
                .attr("height", 100)
                .attr("width", 200)
                .attr('transform', 'translate(90,20)') 
                ;
                //Create colour squares
                legend.selectAll('rect')
                .data(LegendOptions)
                .enter()
                .append("rect")
                .attr("x", cfg.w + 180)
                .attr("y", function(d, i){ return i * 20;})
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function(d, i){ return colorscale(i);})
                ;
                //Create text next to squares
                legend.selectAll('text')
                .data(LegendOptions)
                .enter()
                .append("text")
                .attr("x", cfg.w + 200)
                .attr("y", function(d, i){ return i * 20 + 9;})
                .attr("font-size", "11px")
                .attr("fill", "#737373")
                .text(function(d) { return d; });
        */
        }
    };

    function drawChart(europeFiltered, data) {
        var w = 350, h = 350;

        //Options for the Radar chart, other than default
        var cfg = {
            radius: 5,
            w: w,
            h: h,
            factor: 1,
            factorLegend: .85,
            levels: 5,
            maxValue: 100,
            radians: 2 * Math.PI,
            opacityArea: 0.4,
            ToRight: 5,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.scaleOrdinal().range(["#EDC951","#CC333F","#00A0B0"])
        };

        
        if(data.radarData != null && data.radarData.length != 0){
            // DEBUG
            //console.log("QUIIIIIIIIIIIIIIIII")
            //console.log(data.radarData)
            //console.log(data.radarData.length)
            var radarData = generateRadarData(data.radarData[0]);
            var legendOptions = generateLegendOptions(data.radarData[0])
            MyRadarChart.draw("#container2", radarData, legendOptions, cfg);
        }
        else 
            MyRadarChart.draw("#container2", mock_data2, legendOptions, cfg);
    }

    return <div id="container2" />;
	
}

function generateRadarData(data){
    var radarData = [];
    
    for(let i = 0; i < data.name.length; i++){
        var newData = []
        newData.push({axis: "Population density / 10", value: data.population_density[i] / 10})
        newData.push({axis: "Life Expectancy", value: data.life_expectancy[i] })
        newData.push({axis: "GDP per Capita / 1000", value: data.gdp_per_capita[i] / 1000})
        newData.push({axis: "Extreme Poverty", value: data.extreme_poverty[i] * 10})
        newData.push({axis: "HDI", value: data.human_development_index[i] * 100})

        radarData.push(newData);
    }
    
    return radarData;
}

function generateLegendOptions(data){
    var legendOptions = [];
    
    for(let i = 0; i < data.name.length; i++){
        legendOptions.push(data.name[i]);
    }
    
    return legendOptions;
}
  

export default RadarChart;