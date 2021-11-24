/* eslint-disable no-unused-vars */
import * as d3 from 'd3';
import { useContext } from 'react';
import { colors } from '../../../utils/colors';
import { CONST } from '../../../utils/const';
import { getRandomColor } from '../../../utils/utility';
import './LineChart.css';

const margin = { top: 58, right: 10, bottom: 20, left: 80 };
const chartHeightPosition = window.innerHeight / 2;

function lineWidth() {
    //return differenceBetweenDays(selectedPeriod.from, selectedPeriod.to) > CONST.DATE.MONTH ? CONST.LINECHAR.WIDTH.REGULAR : CONST.LINECHAR.WIDTH.LARGE;
    return CONST.LINECHAR.WIDTH.LARGE;
}


export function drawChart(europeFiltered, selectedCountriesFiltered, width, height, type) {
    const svg =
        d3.select('.svg-container')

    svg.selectAll("*").remove()

    const boundedWidth = width - margin.left - margin.right;
    const boundedHeight = height - margin.top - margin.bottom;

    const yAccessor = (d) => d.value;
    const xAccessor = (d) => d.date;

    const wrapper = d3
        .select("#line_container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${margin.left}px,${margin.top}px)`);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent([0, d3.max(europeFiltered, yAccessor)]))
        .range([boundedHeight, 0]);

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(europeFiltered, xAccessor))
        .range([0, boundedWidth]);

    const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)))
        .curve(d3.curveBasis);

    const europePath = bounds
        .append("path")
        .attr("d", lineGenerator(europeFiltered))
        .attr("fill", "none")
        .attr("stroke", colors.green)
        .attr("stroke-width", lineWidth())
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")

    const circlePointerSelectedCountries = [];

    if (selectedCountriesFiltered.length > 0) {
        assembleCirclePointerSelectedCountries();
    }

    const yAxisGenerator = d3.axisLeft().scale(yScale);
    const yAxis = bounds.append("g").call(yAxisGenerator);

    // Generate X Axis
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounds
        .append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${boundedHeight}px)`);

    const listeningRect = bounds
        .append("rect")
        .attr("class", "listening-rect")
        .attr("width", boundedWidth)
        .attr("height", boundedHeight)
        .on('mousemove', onMouseOver)
        .on('mouseout', onMouseOut)


    const xAxisLine = bounds
        .append("g")
        .append("rect")
        .attr("class", "line")
        .attr("stroke-width", "1px")
        .attr("width", ".5px")
        .attr("height", boundedHeight);

    const tooltip = d3.select("#tooltiplinechart");
    const circlePointer = bounds
        .append("circle")
        .attr("class", "tooltiplinechart-circle")
        .attr("r", 4)
        .attr("stroke", colors.green)
        .attr("fill", "white")
        .attr("stroke-width", 2)
        .style("opacity", 0);

    function onMouseOver(event) {
        const mousePosition = d3.pointer(event);
        const hoveredDate = xScale.invert(mousePosition[0]);

        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - hoveredDate);

        drawEuropeCirclePointer(getDistanceFromHoveredDate);

        if (circlePointerSelectedCountries.length > 0) {
            drawSelectedCountriesCirclePointer(getDistanceFromHoveredDate);
        }
    }

    function onMouseOut() {
        tooltip.style("opacity", 0);
        // circlePointer.style("opacity", 0);
        // xAxisLine.style("opacity", 0);
        xAxisLine.attr("x", xScale(0));

    }

    function drawEuropeCirclePointer(getDistanceFromHoveredDate) {
        const closestIndex = d3.scan(europeFiltered,
            (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
        );

        const closestDataPoint = europeFiltered[closestIndex];
        //console.table(closestDataPoint);
        const closestXValue = xAccessor(closestDataPoint);
        const closestYValue = yAccessor(closestDataPoint);

        tooltip.select("#value").html(closestDataPoint.tooltipContent);

        const x = xScale(closestXValue) + 60 + margin.left;
        const y = yScale(closestYValue) + chartHeightPosition + margin.top * 2;

        //Grab the x and y position of our closest point,
        //shift our tooltip, and hide/show our tooltip appropriately
        tooltip.style("transform", `translate(calc( -50% + ${x}px), calc(-100% + ${y}px))`);

        tooltip.style("opacity", 1);

        circlePointer
            .attr("cx", xScale(closestXValue))
            .attr("cy", yScale(closestYValue))
            .style("opacity", 1);

        xAxisLine.style("opacity", 1);

        xAxisLine.attr("x", xScale(closestXValue));
    }

    function drawSelectedCountriesCirclePointer(getDistanceFromHoveredDate) {
        circlePointerSelectedCountries.map((country) => {
            let closestIndexSC = d3.scan(country.data,
                (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
            );
            let closestDataPointSC = country.data[closestIndexSC];
            let closestXValueSC = xAccessor(closestDataPointSC);
            let closestYValueSC = yAccessor(closestDataPointSC);

            country.pointer
                .attr("cx", xScale(closestXValueSC))
                .attr("cy", yScale(closestYValueSC))
                .style("opacity", 1);
        });
    }

    function assembleCirclePointerSelectedCountries() {


        selectedCountriesFiltered.map((data) => {
            let typedDate = type == CONST.CHART_TYPE.VACCINATIONS ? data.vaccinations : data.cases;
            if (typedDate.length > 0) {
                const color = getRandomColor();
                bounds
                    .append("path")
                    .attr("d", lineGenerator(typedDate))
                    .attr("fill", "none")
                    .attr("stroke", color) //TODO will be randomized
                    .attr("stroke-width", lineWidth())
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")

                circlePointerSelectedCountries.push({
                    name: typedDate[0].label,
                    data: typedDate,
                    pointer: bounds
                        .append("circle")
                        .attr("class", "tooltiplinechart-circle")
                        .attr("r", 4)
                        .attr("stroke", color)
                        .attr("fill", "white")
                        .attr("stroke-width", 2)
                        .style("opacity", 0)
                });
            }
        });
    }

}
