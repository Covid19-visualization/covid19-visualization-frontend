import React, { useContext, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Context } from '../../../context/Provider';


import "./TableChart.css"
import { mock_data2_vacs } from '../../../utils/utility';

function TableChart(props) {

    const margin = { top: 50, right: 50, bottom: 1000, left: 600 };

    const { europeData, selectedCountriesData, selectedPeriod } = useContext(Context);

    const label = ["Country", "Pop. density", "Life Expect", "GDP", "Median age", "HDI"]

    const d = props.data;
    
    useEffect(() => {
        drawChart(europeData, selectedCountriesData); 
    }, [europeData, selectedCountriesData]);

    var MyTableChart = {
        draw: function(id, data, cfg){
            console.log(data)

            d3.select(id).select("table").remove();

            // Create table
            var table = d3.select(id)
                .append("table")
                .attr("class", "table table-success")
            
            // Create head row
            var first_row = table.append("thead")
                            .append("tr");
            
            for(var i = 0; i < label.length; i++){
                first_row.append("th")
                .attr("scope", "col")
                .text(label[i])
            }

            var body =  table.append("tbody")
            for(var i = 0; i < data.name.length; i++){
                var tr = body.append("tr");
                tr.append("th")
                .attr("scope", "row")
                .text(data.name[i]);
                tr.append("td").text(data.population_density[i])
                tr.append("td").text(data.life_expectancy[i])
                tr.append("td").text(data.gdp_per_capita[i])
                tr.append("td").text(data.median_age[i])
                tr.append("td").text(data.human_development_index[i])
            }
        },
        clean: function(id){
            d3.select(id).select("table").remove();
        }
    }

    function drawChart(europeFiltered, data) {

        //Options for the Radar chart, other than default
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

/*
<table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
*/