/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import * as d3 from 'd3';
import { useContext } from 'react';
import { colors } from '../../../utils/colors';
import { CONST } from '../../../utils/const';
import { getRandomColor, visualizeDate } from '../../../utils/utility';
import './LineChart.css';

const margin = { top: 58, right: 10, bottom: 20, left: 80 };
const chartHeightPosition = window.innerHeight / 2;

function lineWidth() {
    //return differenceBetweenDays(selectedPeriod.from, selectedPeriod.to) > CONST.DATE.MONTH ? CONST.LINECHAR.WIDTH.REGULAR : CONST.LINECHAR.WIDTH.LARGE;
    return CONST.LINECHAR.WIDTH.LARGE;
}


export function drawChart(europeFiltered, selectedCountriesFiltered, width, height, type, showEuropeData) {
    const colorscale = d3.scaleOrdinal(d3.schemeCategory10)

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

    var yScale;
    if (showEuropeData) {
        yScale = d3
            .scaleLinear()
            .domain(d3.extent([0, d3.max(europeFiltered, yAccessor)]))
            .range([boundedHeight, 0]);
    }
    else {
        let maxValue = 0;
        selectedCountriesFiltered.map((country) => {
            let currentMax = getCurrentMax(type, country, yAccessor)
            if (currentMax > maxValue) maxValue = currentMax;
        })
        yScale = d3
            .scaleLinear()
            .domain(d3.extent([0, maxValue]))
            .range([boundedHeight, 0]);
    }

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(europeFiltered, xAccessor))
        .range([0, boundedWidth]);

    const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)))
        .curve(d3.curveBasis);

    if (showEuropeData) {
        bounds
            .append("path")
            .attr("id", "pathEurope")
            .attr("d", lineGenerator(europeFiltered))
            .attr("fill", "none")
            .attr("stroke", colors.europeBlue)
            .attr("stroke-width", lineWidth())
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")

    }

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
        .attr("stroke", colors.europeBlue)
        .attr("fill", "white")
        .attr("stroke-width", 2)
        .style("opacity", 0);

    function onMouseOver(event) {
        const mousePosition = d3.pointer(event);
        const hoveredDate = xScale.invert(mousePosition[0]);

        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - hoveredDate);

        let closestEuropeIndex = drawEuropeCirclePointer(getDistanceFromHoveredDate);
        var tooltipHtml = showEuropeData
            ? europeFiltered[closestEuropeIndex].tooltipContent
            : "";

        if (circlePointerSelectedCountries.length > 0) {
            var countryData, maxValue = 0, highestX, highestY;

            circlePointerSelectedCountries.map((country, index) => {
                let color = colorscale(index);

                countryData = drawSelectedCountriesCirclePointer(getDistanceFromHoveredDate, country);
                if (countryData.value > maxValue) {
                    maxValue = countryData.value;
                    highestX = countryData.date;
                    highestY = countryData.value;
                }

                if (index === 0 && !showEuropeData) tooltipHtml = `<b>${visualizeDate(countryData.date) + tooltipHtml}</b>`;
                var text = country.data[countryData.closestIndex].tooltipContent;
                let coloredText = text.replace(/<b>/i,`<b style = "color:${color}">`);
             
                tooltipHtml += coloredText;
            });

            if (!showEuropeData) {
                const x = xScale(highestX) + 60 + margin.left;
                const y = yScale(highestY) + chartHeightPosition + margin.top * 2;

                //Grab the x and y position of our closest point,
                //shift our tooltip, and hide/show our tooltip appropriately
                tooltip.style("transform", `translate(calc( -50% + ${x}px), calc(-100% + ${y}px))`);

                tooltip.style("opacity", 1);
            }

        }

        tooltip.select("#value").html(tooltipHtml);

    }

    function onMouseOut() {
        tooltip.style("opacity", 0);
        // circlePointer.style("opacity", 0);
        // xAxisLine.style("opacity", 0);
        // xAxisLine.attr("x", xScale(0));

    }

    function drawEuropeCirclePointer(getDistanceFromHoveredDate) {
        const closestIndex = d3.scan(europeFiltered,
            (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
        );

        const closestDataPoint = europeFiltered[closestIndex];
        //console.table(closestDataPoint);
        const closestXValue = xAccessor(closestDataPoint);
        const closestYValue = yAccessor(closestDataPoint);

        if (showEuropeData) {

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

            // xAxisLine.style("opacity", 1);

            // xAxisLine.attr("x", xScale(closestXValue));
        }



        return closestIndex
    }

    function drawSelectedCountriesCirclePointer(getDistanceFromHoveredDate, country) {
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

        return { closestIndex: closestIndexSC, date: closestXValueSC, value: closestYValueSC };
    }

    function assembleCirclePointerSelectedCountries() {

        selectedCountriesFiltered.map((data, index) => {
            let typedDate= filterDataByType(data, type);
            console.log(typedDate)

            if (typedDate.length > 0) {
                const color = colorscale(index);
                bounds
                    .append("path")
                    .attr("d", lineGenerator(typedDate))
                    .attr("id", "path"+data.id.replace(/\s/g, ""))
                    .attr("fill", "none")
                    .attr("stroke", color)
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

    function filterDataByType(data, type) {
        switch (type) {
            case CONST.CHART_TYPE.VACCINATIONS:
                return data.vaccinations;
            case CONST.CHART_TYPE.CASES:
                return data.cases;
            case CONST.CHART_TYPE.DEATHS:
                return data.deaths
            default:
                break;
        }
    }

}
function getCurrentMax(type, country, yAccessor) {
    switch (type) {
        case CONST.CHART_TYPE.VACCINATIONS:
            return  d3.max(country.vaccinations, yAccessor);
        case CONST.CHART_TYPE.CASES:
            return d3.max(country.cases, yAccessor);
        case CONST.CHART_TYPE.DEATHS:
            return d3.max(country.deaths, yAccessor);
        default:
            break;
    }
 
}

