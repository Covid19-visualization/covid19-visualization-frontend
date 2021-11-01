import React, { useEffect } from 'react';
import * as d3 from 'd3';

/*
function MapChart(props) {

    const margin = { top: 50, right: 50, bottom: 1000, left: 600 };

    const d = props.data;
    
    useEffect(() => {
        drawChart();
    }, []);

    var MyMapChart = {
        draw: function(id, cfg){
            //Define map projection

            d3.select(id).select("svg").remove();

            var projection = d3.geoMercator()
                                .center([ 13, 52 ]) //comment centrer la carte, longitude, latitude
                                .translate([ cfg.w/2, cfg.h/2 ]) // centrer l'image obtenue dans le svg
                                .scale([ cfg.w/1.8 ]); // zoom, plus la valeur est petit plus le zoom est gros 

            //Define path generator
            var path = d3.geoPath().projection(projection);

            var svg = d3.select(id)
                .append("svg")
                .attr("width", cfg.w)
                .attr("height", cfg.h)

            //Load in GeoJSON data
            
            //Bind data and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features).enter()
                .append("path")
                .attr("d", path)
                .attr("id", function(d){return d.properties.admin})
                .attr("stroke", "rgba(0, 0, 0, 0.2)")
                .attr("fill", "rgba(150, 0, 0, 0.6)");
        }
    }

    function drawChart() {

        //Options for the Radar chart, other than default
        var cfg = {
            w: 760,
            h: 450,
            color: d3.scaleOrdinal(d3.schemeCategory10)
        };

        MyMapChart.draw("#container3", cfg);

    }
    return <div id="container3" />;
}
export default MapChart;
*/