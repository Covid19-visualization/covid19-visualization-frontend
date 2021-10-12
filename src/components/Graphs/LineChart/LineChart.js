/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from 'd3';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { API } from '../../../utils/API';
import { colors } from '../../../utils/colors';
import { CONST } from '../../../utils/const';
import { differenceBetweenDays, refreshData } from '../../../utils/utility';
import './LineChart.css';


function LineChart(props) {
    const { width, height, type } = props;

    const { europeData, selectedCountriesData, selectedPeriod } = useContext(Context);

    const margin = { top: 50, right: 50, bottom: 50, left: 100 };

    useEffect(() => { 
        var europeFiltered = type == CONST.CHART_TYPE.VACCINATIONS ? europeData.vaccinations : europeData.cases;
        var selectedCountriesFiltered = type == CONST.CHART_TYPE.VACCINATIONS ? selectedCountriesData.vaccinations : selectedCountriesData.cases;
        drawChart(europeFiltered, selectedCountriesFiltered); 
    }, [europeData, selectedCountriesData])


    function drawChart(europeFiltered, selectedCountriesFiltered) {

 
        const xScale = generateScaleX(europeFiltered, margin, width)

        const yScale = generateScaleY(europeFiltered, height, margin)

        const line = d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => xScale(d.date))
            .y(d => yScale(d.value))
            .curve(d3.curveBasis);

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeInner((-height / 2)).tickPadding(10))

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).tickSizeInner((-width / 1.5) - 17).tickPadding(10))

        const svg =
            d3.select('.svg-canvas')
                .attr("viewBox", [0, 0, width, height]);

        svg.selectAll("*").remove()

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("path")
            .datum(europeFiltered)
            .sort()
            .attr("fill", "none")
            .attr("stroke", colors.green)
            .attr("stroke-width", lineWidth())
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        svg.append("path")
            .datum(selectedCountriesFiltered)
            .attr("fill", "none")
            .attr("stroke", colors.azure)
            .attr("stroke-width", lineWidth())
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        d3.selectAll('g.tick')
            //only ticks that returned true for the filter will be included
            //in the rest of the method calls:
            .select('line') //grab the tick line
            .attr('class', 'quadrantBorder') //style with a custom class and CSS
            .style('stroke-width', 0.1); //or style directly with attributes or inline styles
    }

    function lineWidth() {
        return differenceBetweenDays(selectedPeriod.from, selectedPeriod.to) > CONST.DATE.MONTH ? CONST.LINECHAR.WIDTH.REGULAR : CONST.LINECHAR.WIDTH.LARGE;
    }

    return <svg className="svg-canvas" />;
}

export default LineChart;


function generateScaleY(dataset, height, margin) {
    return d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);
}

function generateScaleX(dataset, margin, width) {
    return d3.scaleTime()
        .nice()
        .domain(d3.extent(dataset, d => d.date))
        .range([margin.left, width - margin.right]);
}

