/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useRef, useEffect } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import { Context } from '../../../context/Provider';
import {getFeature, getType, legend, useResizeObserver} from "./GeoUtility"
import { countries_colors } from "../../../utils/utility";
import * as d3 from 'd3';

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
  //console.log(countries)
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
        ...(countries.find((itmInner) => itmInner._id === data.features[i].properties.NAME))}
      );
    }
    //console.log(data2)
    var tooltipText = "";

    //coloring the map
    const minProp = min(data2, feature => getType(type, feature).feature);
    const maxProp = max(data2, feature => getType(type, feature).feature);
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", getType(type, '').color]);

    const color = d3.scaleSequential()
    .domain([minProp, maxProp])
    .range(["#ccc", getType(type, '').color])

    const svg_legend = select("#legend")
      .attr('transform', 'translate(-120, -43)')
      .append('g')
      .attr('transform', 'translate(200, 0)')
      .append(() => legend({color, 
                            title: `Covid-19 ${getType(type, '').id}`,
                            ticks: 5,
                            tickFormat: '.0s'}));
    
    // projects geo-coordinates on a 2D plane
    var selected = getFeature(data2, selectedCountry)
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
        if(getType(type, feature).feature != null)
          handleCountrySelection(feature.properties.NAME);
      })
      .attr("class", "country")
      .transition()
      .duration(1000)
      .attr("fill", feature => colorScale(getType(type, feature).feature))
      .attr("d", feature => pathGenerator(feature));

    /*
    if(selected != null){
      var tooltip = d3.select(".tooltipgeochart-value")
        tooltipText = `<h3 style='color: ${countries_colors[selected._id]}'>${selected._id}</h3>`;
        tooltip.style("visibility", "visible")
        tooltip.attr("transform", `translate(50, 50)`)
        tooltip.select("#value").html(tooltipText);
    }
    */
    console.log(selectedCountry)
    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        selectedCountry
      )
      .attr("font-size", 5)
      .attr("x", 10)
      .attr("y", 95);
  }

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
      <svg id="legend" width="700" height="80"></svg>
    </div>
  );
}

export default GeoChart;