import React, { useContext, useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import { Context } from '../../../context/Provider';
//import LoadCountriesTask from "../GeoChart/LoadContriesTask";
import { CONST } from "../../../utils/const";
import { NavItem } from "react-bootstrap";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a map
 */

function GeoChart(props) {
  const { data, type } = props;
  const { selectedCountries, countries, setSelectedCountries } = useContext(Context);

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const [selectedCountry, setSelectedCountry] = useState(null);

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

  // will be called initially and on every data change
  useEffect(() => {

    //let countryAux = countries.filter((item)=>selectedCountries.includes(item._id));
    //console.log(countryAux);
    
    DrawMap()
  }, [countries, selectedCountries, selectedCountry, data, dimensions]);

  function DrawMap(){
    //console.log(selectedCountriesFiltered)
    const svg = select(svgRef.current)
      .attr("viewBox", [1200, 300, 950, 600])

    //console.log(data.features)
    //console.log(countriesFiltered)
    let data2 = []
    for(let i=0; i<data.features.length; i++) {
      data2.push({
        ...data.features[i], 
        ...(countries.find((itmInner) => itmInner._id === data.features[i].properties.sovereignt))}
      );
    }
    //console.log(data2) 
  
    //coloring the map
    const minProp = min(data2, feature => feature.total_new_deaths);
    const maxProp = max(data2, feature => feature.total_new_deaths);
    console.log(minProp, maxProp)
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "red"]);
    
    
    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane

    const projection = geoMercator()
      .fitSize([width*3.9, height*2.7], data) //2.3 1.8
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(data2)
      .join("path")
      .on("click", (e, feature) => {
        handleCountrySelection(feature.properties.sovereignt);
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .duration(1000)
      .attr("fill", feature => colorScale(feature.total_new_deaths))
      .attr("d", feature => pathGenerator(feature));
    // render text
    /*svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      //.attr("stroke-width", lineWidth())
      .text(
        feature =>
          feature &&
             feature.properties.name + ":" + feature.total_cases
        type == CONST.CHART_TYPE.VACCINATIONS 
          ? countriesFiltered[0].total_vaccinations 
          : countriesFiltered[0].total_cases
      )
      .attr("x", 1200) //2000
      .attr("y", 800); //800*/
      
  }

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>  
     
    </div>
  );
}

export default GeoChart;
