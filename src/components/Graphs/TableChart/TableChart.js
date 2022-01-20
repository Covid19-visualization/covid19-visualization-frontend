/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { countries_colors } from '../../../utils/colors';
import * as d3 from 'd3';
import { CONST } from '../../../utils/const';
import { prettyCounterHandler, onClick, onMouseOut } from '../../../utils/utility'
import "./TableChart.css" 

function TableChart(props) {

    var { europeData, selectedCountriesDataByName, selectedCountry, setSelectedCountry, isClicked} = useContext(Context);

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
                  var tr = body.append("tr").attr("id", country.id.replace(/\s/g, ""));
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
                    if(!isClicked){
                      setSelectedCountry(country.id)
                      onClick(d3.select(this).attr("id").replace(/\s/g, ""), cfg);
                      isClicked = true;
                    }
                    else{
                      setSelectedCountry(null)
                      onMouseOut(d3.select(this).attr("id").replace(/\s/g, ""), cfg);
                      isClicked = false;
                    }
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
                  var tr = body.append("tr").attr("id", country.id.replace(/\s/g, ""));
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
                    if(!isClicked){
                      setSelectedCountry(country.id)
                      onClick(d3.select(this).attr("id").replace(/\s/g, ""), cfg);
                      isClicked = true;
                    }
                    else{
                      setSelectedCountry(null)
                      onMouseOut(d3.select(this).attr("id").replace(/\s/g, ""), cfg);
                      isClicked = false;
                    }
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
            colorInteraction: ["#292b2c", "#a9a9a9"],
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