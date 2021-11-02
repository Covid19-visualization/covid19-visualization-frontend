import React, { useContext, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Context } from '../../../context/Provider';
import { CONST } from '../../../utils/const';



import "./TableChart.css"
import { mock_data2_vacs } from '../../../utils/utility';

function TableChart(props) {

    const margin = { top: 50, right: 50, bottom: 1000, left: 600 };

    const type = props.type;

    const { europeData, selectedCountriesData, selectedPeriod } = useContext(Context);

    const label_vacs = ["Country", "Pop. density", "Life Expect", "GDP", "Median age", "HDI"]
    const label_cases = ["Country", "Pop. density", "Smokers", "CDR", "Diab preval", "Median age"]

    const d = props.data;
    
    useEffect(() => {
        drawChart(europeData, selectedCountriesData); 
    }, [europeData, selectedCountriesData]);

    var MyTableChart = {
        draw: function(id, data, cfg){
            d3.select(id).select("table").remove();

            // Create table
            var table = d3.select(id)
                .append("table")
                .attr("class", "table table-inverse")
            
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
              for(var i = 0; i < data.name.length; i++){
                  var tr = body.append("tr").attr("id", data.name[i]);
                  tr.append("th")
                  .attr("scope", "row")
                  .text(data.name[i]);
                  tr.append("td").text(data.population_density[i])
                  tr.append("td").text(data.life_expectancy[i])
                  tr.append("td").text(data.gdp_per_capita[i])
                  tr.append("td").text(data.median_age[i])
                  tr.append("td").text(data.human_development_index[i])
                  tr.on('click', function (d){
                    d3.select(this).style("background-color", "#3399ff");
                    var id = d3.select(this).attr("id").replace(/\s/g, "");
                    var g = d3.select("#polygons");
                    var z = d3.select("#polygon"+id);

                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0); 
                    z.transition(200)
                        .style("fill-opacity", 0.8);
                  });
                  tr.on('mouseout', function(){
                    d3.select(this).style("background-color", "#292b2c");
                    var id = d3.select(this).attr("id").replace(/\s/g, "");
                    var g = d3.select("#polygons");
                    var z = d3.select("#polygon"+id);

                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.4);
                  });
                }
              }
              
              else{
                for(var i = 0; i < label_vacs.length; i++){
                  first_row.append("th")
                  .attr("scope", "col")
                  .text(label_cases[i])
              }

              var body =  table.append("tbody")
              for(var i = 0; i < data.name.length; i++){
                  var tr = body.append("tr").attr("id", data.name[i]);
                  tr.append("th")
                  .attr("scope", "row")
                  .text(data.name[i]);
                  tr.append("td").text(data.population_density[i])
                  tr.append("td").text(data.male_smokers[i] + data.female_smokers[i])
                  tr.append("td").text(data.cardiovasc_death_rate[i])
                  tr.append("td").text(data.diabetes_prevalence[i])
                  tr.append("td").text(data.median_age[i])
                  tr.on('click', function (d){
                    d3.select(this).style("background-color", "#3399ff");
                    var id = d3.select(this).attr("id").replace(/\s/g, "");
                    var g = d3.select("#polygons");
                    var z = d3.select("#polygon"+id);

                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0); 
                    z.transition(200)
                        .style("fill-opacity", 0.8);
                  });
                  tr.on('mouseout', function(){
                    d3.select(this).style("background-color", "#292b2c");
                    var id = d3.select(this).attr("id").replace(/\s/g, "");
                    var g = d3.select("#polygons");
                    var z = d3.select("#polygon"+id);

                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.4);
                  });
                }
              }
        },
        clean: function(idx){
            d3.select(idx).select("table").remove();
        }
    }

    function drawChart(europeFiltered, data) {

        var cfg = {
            w: 400,
            h: 200,
            color: d3.scaleOrdinal(d3.schemeCategory10)
        };
    
        if(data.radarData != null && data.radarData.length != 0){
            MyTableChart.draw("#table_container", data.radarData[0], cfg);
        }
        else{
            MyTableChart.clean("#table_container");
        }
    }
    return <div class="card" id="table_container" />;

}
export default TableChart;