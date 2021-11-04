import React, { useContext, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Context } from '../../../context/Provider';
import { CONST } from '../../../utils/const';

import "./SunburstChart.css"
import { mock_data2_vacs } from '../../../utils/utility';

function SunburstChart(props) {

    const margin = { top: 50, right: 50, bottom: 1000, left: 600 };

    const { europeData, selectedCountriesData, selectedPeriod } = useContext(Context);
    
    useEffect(() => {
        drawChart(europeData, selectedCountriesData); 
    }, [europeData, selectedCountriesData]);

    var MySunburstChart = {
        draw: function(id, data, cfg){
            // JSON data
            d3.select(id).select("svg").remove();

            var nodeData = {
                "name": "TOPICS", "children": [{
                    "name": "Topic A",
                    "children": [{"name": "Sub A1", "size": 4}, {"name": "Sub A2", "size": 4}]
                }, {
                    "name": "Topic B",
                    "children": [{"name": "Sub B1", "size": 3}, {"name": "Sub B2", "size": 3}, {
                        "name": "Sub B3", "size": 3}]
                }, {
                    "name": "Topic C",
                    "children": [{"name": "Sub A1", "size": 4}, {"name": "Sub A2", "size": 4}]
                }]
            };

            // Variables
            var radius = Math.min(cfg.w, cfg.h) / 2;
            var color = d3.scaleOrdinal(d3.schemeCategory10);

            // Create primary <g> element
            var g = d3.select(id)
                .append("svg")
                .attr('width', cfg.w)
                .attr('height', cfg.h)
                .append('g')
                .attr('transform', 'translate(' + cfg.w / 2 + ',' + cfg.h / 2 + ')');

            // Data strucure
            var partition = d3.partition()
                .size([2 * Math.PI, radius]);

            // Find data root
            var root = d3.hierarchy(nodeData)
                .sum(function (d) { return d.size});

            // Size arcs
            partition(root);
            var arc = d3.arc()
                .startAngle(function (d) { return d.x0 })
                .endAngle(function (d) { return d.x1 })
                .innerRadius(function (d) { return d.y0 })
                .outerRadius(function (d) { return d.y1 });

            // Put it all together
            g.selectAll('path')
                .data(root.descendants())
                .enter().append('path')
                .attr("display", function (d) { return d.depth ? null : "none"; })
                .attr("d", arc)
                .style('stroke', '#fff')
                .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); 
            });
        }
    }

    function drawChart(europeFiltered, data) {

        var cfg = {
            w: 300,
            h: 300,
            color: d3.scaleOrdinal(d3.schemeCategory10)
        };
    
        MySunburstChart.draw("#sunburst_container", data.radarData[0], cfg);
    }
    return <div class="card" id="sunburst_container" />;

}
export default SunburstChart;