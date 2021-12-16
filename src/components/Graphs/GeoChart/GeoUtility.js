/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import { CONST } from "../../../utils/const";
import * as d3 from 'd3';
import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";


export function getType(type, feature){
    if(type === CONST.CHART_TYPE.VACCINATIONS) return {id: "Vaccinations", feature:feature.total_vaccinations, color:"green"}
    else if(type === CONST.CHART_TYPE.CASES) return {id: "Cases", feature:feature.total_cases, color:"blue"}
    else return {id: "Deaths", feature:feature.total_new_deaths, color:"red"}
  }
  
export function getFeature(data, country){
    for(var i = 0; i < data.length; i++){
        if(String(country) == String(data[i]._id)){
            return data[i];
        }
    }
}
  
export function legend({
        color,
        title,
        tickSize = 1,
        width = 500,
        height = 44 + tickSize,
        marginTop = 18,
        marginRight = 0,
        marginBottom = 16 + tickSize,
        marginLeft = 0,
        ticks = width / 64,
        tickFormat,
        tickValues
    } = {}) {
    
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");
    
    let x;
    
      // Continuous
    if (color.interpolator) {
        x = Object.assign(color.copy()
            .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
                range() {
                    return [marginLeft, width - marginRight];
                }
            });
    
        svg.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight + 50)
            .attr("height", height - marginTop - marginBottom + 600)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.interpolator()).toDataURL());
    
        // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
        if (!x.ticks) {
            if (tickValues === undefined) {
                const n = Math.round(ticks + 1);
                tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
            }
            if (typeof tickFormat !== "function") {
                tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
            }
        }
    }
    
    // Discrete
    else if (color.invertExtent) {
        const thresholds = color.thresholds ? color.thresholds() // scaleQuantize
            :
            color.quantiles ? color.quantiles() // scaleQuantile
            :
            color.domain(); // scaleThreshold
    
        const thresholdFormat = tickFormat === undefined ? d => d :
            typeof tickFormat === "string" ? d3.format(tickFormat) :
            tickFormat;
    
        x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([marginLeft, width - marginRight]);
    
        svg.append("g")
            .selectAll("rect")
            .data(color.range())
            .join("rect")
            .attr("x", (d, i) => x(i - 1))
            .attr("y", marginTop)
            .attr("width", (d, i) => x(i) - x(i - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", d => d);
    
        tickValues = d3.range(thresholds.length);
        tickFormat = i => thresholdFormat(thresholds[i], i);
    }
    
    svg.append("g")
        .attr("transform", `translate(0, ${height - marginBottom})`)
        .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
        .call(g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-size", "12px")
        .text(title));
    
    return svg.node();
}

function ramp(color, n = 512) {
    const canvas = document.getElementById('my_dataviz');
    const context = canvas.getContext("2d");
    canvas.style.margin = "0 -14px";
    canvas.style.width = "calc(100% + 28px)";
    canvas.style.height = "40px";
    canvas.style.imageRendering = "-moz-crisp-edges";
    canvas.style.imageRendering = "pixelated";
    for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
    }
    return canvas;
}

export const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
      const observeTarget = ref.current;
      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          setDimensions(entry.contentRect);
        });
      });
      resizeObserver.observe(observeTarget);
      return () => {
        resizeObserver.unobserve(observeTarget);
      };
    }, [ref]);
    return dimensions;
};