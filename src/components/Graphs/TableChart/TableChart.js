/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { MyTableChart } from './Drawer';
import { countries_colors } from '../../../utils/utility';
import * as d3 from 'd3';
import { CONST } from '../../../utils/const';
import { prettyCounterHandler } from '../../../utils/utility'
import "./TableChart.css"

function TableChart(props) {

    const { europeData, selectedCountriesDataByName, selectedCountry, setSelectedCountry} = useContext(Context);

    useEffect(() => {
        drawChart(europeData, selectedCountriesDataByName); 
    }, [europeData, selectedCountriesDataByName]);

    const MyTableChart = {
        draw: function(id, data, cfg){
    
            const label_vacs = ["Country", "Population", "Pop. density", "Life Expect", "GDP", "Median age", "HDI"]
            const label_cases = ["Country", "Population", "Pop. density", "Smokers", "CDR", "Diab preval", "Median age"]
    
            const margin = { top: 50, right: 50, bottom: 1000, left: 600 };
    
            var type = cfg.type;
    
            d3.select(id).select("table").remove();
    
            var Format = d3.format('.6');
            var FormatLong = (a) => prettyCounterHandler(a, CONST.COUNTER_HANDLER.LONG)
    
            // Create table
            var table = d3.select(id)
                .append("table")
                .attr("class", "table table-inverse table-responsive")
            
            // Create head row
            var first_row = table.append("thead")
                            .append("tr");
    
    
            if(type == CONST.CHART_TYPE.VACCINATIONS){
              for(var i = 0; i < label_vacs.length; i++){
                  first_row.append("th")
                  .attr("scope", "col")
                  .text(label_vacs[i])
              }
    
              var body =  table.append("tbody")
              data.forEach(country =>{
                  var tr = body.append("tr").attr("id", country.id);
                  tr.append("th")
                  .attr("scope", "row")
                  .html(`<a style='color: ${cfg.color[country.id]};'>${country.id}</a>`);
                  tr.append("td").text(FormatLong(country.radarData.population))
                  tr.append("td").text(Format(country.radarData.population_density))
                  tr.append("td").text(Format(country.radarData.life_expectancy))
                  tr.append("td").text(Format(country.radarData.gdp_per_capita))
                  tr.append("td").text(Format(country.radarData.median_age))
                  tr.append("td").text(Format(country.radarData.human_development_index))
                  tr.on('click', function (d){
                    d3.select(this).style("background-color", cfg.colorSelection[1]);
                    var id = d3.select(this).attr("id").replace(/\s/g, "");
                    var g = d3.select("#polygons");
                    var p_selected = d3.select("#polygon"+id);
                    var r_selected = d3.selectAll("#rect"+id);
                    var l_selected = d3.selectAll("#path"+id);
                    var bar = d3.select("#bar_container");
                    var line = d3.select("#line_container")
    
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0); 
                    bar.selectAll("rect")
                        .transition(200)
                        .style("fill-opacity", 0.2);
                    line.selectAll("path")
                        .transition(200)
                        .style("stroke-opacity", 0.2);
                    line.selectAll("path.domain")
                        .transition(200)
                        .style("stroke-opacity", 1);
                    p_selected.transition(200)
                        .style("fill-opacity", cfg.full_opacity);
                    r_selected.transition(200)
                        .style("fill-opacity", 1);
                    l_selected.transition(200)
                        .style("stroke-opacity", 1);

                    setSelectedCountry(d3.select(this).attr("id"))
                  });
                  tr.on('mouseout', function(){
                    d3.select(this).style("background-color", cfg.colorSelection[0]);
                    var id = d3.select(this).attr("id").replace(/\s/g, "");
                    var g = d3.select("#polygons");
                    var bar = d3.select("#bar_container");
                    var line = d3.select("#line_container");
                    var tooltipbar = d3.select("#tooltipgeochart");
    
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.standard_opacity);
                    bar.selectAll("rect")
                        .transition(200)
                        .style("fill-opacity", 1);
                    line.selectAll("path")
                        .transition(200)
                        .style("stroke-opacity", 1);
                    //tooltipbar.style("visibility", "hidden");
                    
                    setSelectedCountry(null)
                  });
                });
              }
              
              else{
                for(var i = 0; i < label_vacs.length; i++){
                  first_row.append("th")
                  .attr("scope", "col")
                  .text(label_cases[i])
              }
    
              var body =  table.append("tbody")
              data.forEach(country =>{
                  var tr = body.append("tr").attr("id", country.id);
                  tr.append("th")
                  .attr("scope", "row")
                  .html(`<a style='color: ${cfg.color[country.id]}'>${country.id}</a>`)
                  tr.append("td").text(FormatLong(country.radarData.population))
                  tr.append("td").text(Format(country.radarData.population_density))
                  tr.append("td").text(Format(country.radarData.male_smokers + country.radarData.female_smokers))
                  tr.append("td").text(Format(country.radarData.cardiovasc_death_rate))
                  tr.append("td").text(Format(country.radarData.diabetes_prevalence))
                  tr.append("td").text(Format(country.radarData.median_age))
                  tr.on('click', function (d){
                    d3.select(this).style("background-color", cfg.colorSelection[1]);
                    var id = d3.select(this).attr("id").replace(/\s/g, "");
                    var g = d3.select("#polygons");
                    var p_selected = d3.select("#polygon"+id);
                    var c_selected = "circle#"+id;
                    var l_selected = d3.selectAll("#path"+id);
                    var r_selected = d3.selectAll("#rect"+id);
                    var pca = d3.select("#pca_container");
                    var line = d3.select("#line_container")
                    var bar = d3.select("#bar_container");
    
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0);
                    bar.selectAll("rect")
                        .transition(200)
                        .style("fill-opacity", 0.2);
                    pca.selectAll("circle")
                        .transition(200)
                        .style("fill-opacity", 0); 
                    pca.selectAll(c_selected)
                        .transition(200)
                        .style("fill-opacity", 1);
                    line.selectAll("path")
                        .transition(200)
                        .style("stroke-opacity", 0.2);
                    line.selectAll("path.domain")
                        .transition(200)
                        .style("stroke-opacity", 1);
    
                    p_selected.transition(200)
                        .style("fill-opacity", cfg.full_opacity);
                    l_selected.transition(200)
                        .style("stroke-opacity", 1);
                    r_selected.transition(200)
                        .style("fill-opacity", 1);

                    setSelectedCountry(d3.select(this).attr("id"))
                  });
    
                  tr.on('mouseout', function(){
                    d3.select(this).style("background-color", cfg.colorSelection[0]);
                    var g = d3.select("#polygons");
                    var pca = d3.select("#pca_container");
                    var line = d3.select("#line_container");
                    var bar = d3.select("#bar_container");
    
                    pca.selectAll("circle")
                        .transition(200)
                        .style("fill-opacity", 1);
                    bar.selectAll("rect")
                        .transition(200)
                        .style("fill-opacity", 1);
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.standard_opacity);
                    line.selectAll("path")
                        .transition(200)
                        .style("stroke-opacity", 1);
                    //tooltipbar.style("visibility", "hidden");
                    
                    setSelectedCountry(null)
                  });
                });
              }
        },
        clean: function(ids){
            d3.select(ids).select("table").remove();
        }
    }

    function drawChart(europeData, data) {

        var cfg = {
            w: 400,
            h: 200,
            standard_opacity: 0.4,
            full_opacity: 0.8,
            color: countries_colors,
            colorSelection: ["#292b2c", "#3399ff"],
            type: props.type
        };
    
        if(data != null && data.length != 0){
            MyTableChart.draw("#table_container", data, cfg);
        }
        else if(europeData.radarData != null && europeData.radarData.length != 0){
            europeData["id"] = "Europe";
            MyTableChart.draw("#table_container", [europeData], cfg);
        }
        else{
            MyTableChart.clean("#table_container");
        }
    }
    return <div className="card" id="table_container" />;

}
export default TableChart;