import React, { useContext, useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import { Context } from '../../../context/Provider';
//import LoadCountriesTask from "../GeoChart/LoadContriesTask";
import { CONST } from "../../../utils/const";
import { differenceBetweenDays, refreshData } from '../../../utils/utility';
//import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a map
 */

function GeoChart({ data, props }) {

  const type = props;
  const { europeData, selectedCountriesData, selectedPeriod } = useContext(Context);


  const svgRef = useRef();
  const wrapperRef = useRef();
  //const dimensions = useResizeObserver(wrapperRef);

  
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  
  //load covid data contries
  /*
  const load = () => {
    console.log("load");
    const loadCountriesTask = new LoadCountriesTask();
    loadCountriesTask.load((countries) => setSelectedCountry(countries));
  };
  */
  // will be called initially and on every data change
  useEffect(() => {
    var selectedCountriesFiltered = type == CONST.CHART_TYPE.VACCINATIONS ? selectedCountriesData.vaccinations : selectedCountriesData.cases;
    DrawMap(selectedCountriesFiltered)
  }, [data, selectedCountry, selectedCountriesData]);

  function DrawMap(selectedCountriesFiltered ){
    const svg = select(svgRef.current)
      .attr("viewBox", [1200, 300, 950, 600])

    
    //coloring the map
    const minProp = min(data.features, feature => CONST.CHART_TYPE.VACCINATIONS);
    const maxProp = max(data.features, feature => CONST.CHART_TYPE.VACCINATIONS);
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
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      //.transition()
      //.duration(1000)
      .attr("fill", feature => colorScale(CONST.CHART_TYPE.VACCINATIONS))
      .attr("d", feature => pathGenerator(feature));
 
    // render text
    svg
      .selectAll(".label")
      .data([selectedCountriesFiltered])
      .join("text")
      .attr("class", "label")
      .attr("stroke-width", lineWidth())
      .text(
          selectedCountriesFiltered
      )
      .attr("x", 1200) //2000
      .attr("y", 800); //800
  }

  function lineWidth() {
    return differenceBetweenDays(selectedPeriod.from, selectedPeriod.to) > CONST.DATE.MONTH ? CONST.LINECHAR.WIDTH.REGULAR : CONST.LINECHAR.WIDTH.LARGE;
  }
  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default GeoChart;
