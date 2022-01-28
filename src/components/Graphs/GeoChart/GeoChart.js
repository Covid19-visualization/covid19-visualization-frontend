/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useRef, useEffect } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import { Context } from '../../../context/Provider';
import {getFeature, getType, legend, useResizeObserver} from "./GeoUtility"
import { countries_colors } from '../../../utils/colors';
import { prettyCounterHandler, visualizeDate } from '../../../utils/utility'
import { CONST } from '../../../utils/const';
import * as d3 from 'd3';

import './GeoChart.css';
 

/**
 * Component that renders a map
 */

function GeoChart(props) {
  const { width, height, data, type } = props;
  const { selectedCountries, countries, setSelectedCountries, selectedCountry, setSelectedCountry} = useContext(Context);

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const handleCountrySelection = (name) => {
    let selectionAux = selectedCountries;
    let selected = selectedCountries.includes(name);

    if(!selected) {
        selectionAux.push(name)
        setSelectedCountries([...selectionAux])
    }
    else {
        setSelectedCountries([...selectionAux.filter((country) => country != name)])
    }
    
  }
  useEffect(() => {
    DrawMap()
  }, [countries, selectedCountries, selectedCountry, data, dimensions]);

  function DrawMap(){
    const svg = select(svgRef.current)
      .attr('transform', 'translate(0, -40)')
      .attr("viewBox", [0, 0, width, height])
    
    let data2 = []
    for(let i=0; i<data.features.length; i++) {
      data2.push({
        ...data.features[i], 
        ...(countries.find((itmInner) => itmInner._id.name === data.features[i].properties.NAME))}
      );
    }

    var tooltipText = "";
    const tooltip = d3.select("#tooltipgeochart");
    tooltip.style("visibility", "hidden")

    var FormatLong = (a) => prettyCounterHandler(a, CONST.COUNTER_HANDLER.LONG)

    //coloring the map
    const minProp = min(data2, feature => getType(type, feature).feature);
    const maxProp = max(data2, feature => getType(type, feature).feature);
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", getType(type, '').color]);

    const color = d3.scaleSequential()
    .domain([minProp, maxProp])
    .range(["#ccc", getType(type, '').color])

    d3.select("#legend").remove()
    const svg_legend = select("#legenddiv")
      .attr('transform', 'translate(-120, -43)')
      .append('g')
      .attr("id", "legend")
      .attr('transform', 'translate(180, 0)')
      .append(() => legend({color, 
                            title: `Covid-19 ${getType(type, '').id}`,
                            ticks: 5,
                            tickFormat: '.0s'}));
    
    // projects geo-coordinates on a 2D plane
    var selected = selectedCountry != null ? getFeature(data2, selectedCountry) : null
    var projection = geoMercator()
      .fitSize([width, height], selected == null ? data : selected) 
      .precision(100)

    // takes geojson data,
    // transforms that into the d attribute of a path element
    var pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(data2)
      .join("path")

      .on("click", (e, feature) => {
        handleCountrySelection(feature.properties.NAME);
      })
      .attr("class", "country")
      .transition()
      .duration(1000)
      .attr("fill", feature => colorScale(getType(type, feature).feature))
      .attr("d", feature => pathGenerator(feature));


    if(selected != null){
      tooltipText = `<h3 style='color: ${countries_colors[selectedCountry]}'>${selectedCountry}</h3>` +
            `<b style='text-align: center'> ${visualizeDate(new Date(selected._id.date))}</b>` + 
            "<br>" +  
            `<a style='color: #199AFB' >Total cases: </a>${FormatLong(selected.total_cases)}` +
            "<br>" + 
            `<a style='color: red' >Total deaths: </a>${FormatLong(selected.total_new_deaths)}` +
            "<br>" + 
            `<a style='color: green' >People fully vaccinated: </a>${FormatLong(selected.people_fully_vaccinated)}` ;
      tooltip.style("visibility", "visible")
      tooltip.select("#value").html(tooltipText);
    }
  }

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
      <svg id="legenddiv" width="700" height="80"></svg>
      <div width="100" height="80" id="tooltipgeochart" className="tooltipgeochart">
          <div className="tooltipgeochart-value">
              <span id="value"></span>
          </div>
      </div>
    </div>
  );
}

export default GeoChart;