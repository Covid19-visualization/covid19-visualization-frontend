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
  //const dimensions = useResizeObserver(wrapperRef);

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
    //let covidCountries = countries.filter((item)=>selectedCountries.includes(item._id));
    //console.log(covidCountries);
    /*const processCovidData = (covidCountries) => {
      
      for (let i=0; i<data.features.length; i++){
        selectedCountry = data.features[i];
        const covidCountry = covidCountries.find(
          (covidCountry) => covidCountry._id === selectedCountry.properties.name
        );

        selectedCountry.properties.confirmed = 0;
        selectedCountry.properties.confirmedText = "0";

        if(covidCountry != null){
          let confirmed = Number(covidCountry.confirmed);
          selectedCountry.properties.confirmed = confirmed;
          selectedCountry.properties.confirmedText = confirmed;
        }
      }
      this.setState(data.features);

    }*/
    //console.log(processCovidData)
    //countries.map((item)=>console.log(item))
    //let countryAux = countries.filter((item)=>selectedCountries.includes(item._id));
    //let countryAux = countries.filter((item)=>countries.includes(item._id));
    let countryAux = countries.filter((item)=>countries.includes(item));
    //console.log(countryAux);
    /*if(type == CONST.CHART_TYPE.VACCINATIONS){
      var selectedCountriesFiltered = countryAux.total_vaccinations;
    }else{
      var selectedCountriesFiltered = countryAux.total_cases;
    }*/
    //console.log(countryAux.length)
    /*if(countryAux.length>0){
      //console.log(countryAux[0].total_cases)
      DrawMap(countryAux)
    }*/

    
    DrawMap(countryAux)
  }, [countries, selectedCountries, selectedCountry, data]);

  function DrawMap(countriesFiltered){
    //console.log(selectedCountriesFiltered)
    const svg = select(svgRef.current)
      .attr("viewBox", [1200, 300, 950, 600])

    //var mapData = generateMapData(selectedCountriesFiltered, type)
    
    //coloring the map
    /*for(let i = 0; i<countriesFiltered.length; i++){
      
    }*/
    const minProp = min(countriesFiltered, countries => countries.total_vaccinations);
    const maxProp = max(countriesFiltered, countries => countries.total_vaccinations);
    console.log(minProp, maxProp)
    console.log(data)
    console.log(countries)
    let data2 = []
    for(let i=0; i<data.length; i++) {
      data2.push({
        ...data[i], 
        ...(countries.find((itmInner) => itmInner._id === data[i].features.properties.sovereignt))}
      );
    }
    console.log(data2) 

    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "red"]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    //const height = svgRef.current.clientHeight
    //const width = svgRef.current.clientWidth
    const { width, height } =
      wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane

    const projection = geoMercator()
      .fitSize([width*2.3, height*1.8], data) //2.3 1.8
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (e, feature) => {
        handleCountrySelection(feature.properties.sovereignt);
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .duration(1000)
      .attr("fill", (feature, countries) => {
        if(feature.properties.sovereignt === countries._id){
          colorScale(countries.total_vaccinations)
        }
      })
      .attr("d", feature => pathGenerator(feature));
    // render text
    /*if(feature=>feature.properties.name === selectedCountriesFiltered[0]._id){
      var textData = selectedCountriesFiltered.total_vaccinations
    }*/
    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      //.attr("stroke-width", lineWidth())
      .text(
        feature =>
          feature &&
            feature.properties.name + ":"
        /*type == CONST.CHART_TYPE.VACCINATIONS 
          ? countriesFiltered[0].total_vaccinations 
          : countriesFiltered[0].total_cases*/
      )
      .attr("x", 1200) //2000
      .attr("y", 800); //800
  }

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>  
     
    </div>
  );
}

export default GeoChart;
/*
function GeoChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current)
      .attr("viewBox", [1200, 300, 950, 600]);

    const minProp = min(data.features, feature => feature.properties[property]);
    const maxProp = max(data.features, feature => feature.properties[property]);
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "red"]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width*2.3, height*1.8], selectedCountry || data) //2.3 1.8
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (e, feature) => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .duration(1000)
      .attr("fill", feature => colorScale(feature.properties[property]))
      .attr("d", feature => pathGenerator(feature));
 
    // render text
    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        feature =>
          feature &&
          feature.properties.name +
            ": " +
            feature.properties[property].toLocaleString()
      )
      .attr("x", 1200)
      .attr("y", 800);
  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}*/



