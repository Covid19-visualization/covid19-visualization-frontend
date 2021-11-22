import * as d3 from 'd3';
import { colors } from '../../../utils/colors';
import { CONST } from '../../../utils/const';

function generateScaleY(dataset, height, margin) {
    return d3.scaleLinear()
        .nice()
        .domain([0, d3.max(dataset, d => d.value)])
        .range([height - margin.bottom, margin.top]);
}

function generateScaleX(dataset, margin, width) {
    return d3.scaleTime()
        .nice()
        .domain(d3.extent(dataset, d => d.date))
        .range([margin.left, width - margin.right])

}

function lineWidth() {
    //return differenceBetweenDays(selectedPeriod.from, selectedPeriod.to) > CONST.DATE.MONTH ? CONST.LINECHAR.WIDTH.REGULAR : CONST.LINECHAR.WIDTH.LARGE;
    return CONST.LINECHAR.WIDTH.REGULAR;
}



export function drawChart(europeFiltered, selectedCountriesFiltered, margin, width, height) {

    const xScale = generateScaleX(europeFiltered, margin, width)

    const yScale = generateScaleY(europeFiltered, height, margin)

    const line = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(d3.curveBasis);

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .style("font-size", "6px")
        .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeInner((-height / 2)).tickPadding(10))

    const tooltip = d3.select("#tooltip");

    d3.selectAll('circle')
        .on("mouseover", onMouseEnter)
        .on("mouseout", onMouseLeave)

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .style("font-size", "6px")
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

    svg.selectAll("circle")
        .data(europeFiltered)
        .enter().append("circle")
        .attr("r", 1.3)
        .attr("cx", function (d) { return xScale(d.date); })
        .attr("cy", function (d) { return yScale(d.value); })
        .style("fill", "none")
        .style("stroke", "none")
        .style("pointer-events", "all")
        .on('mouseover', function (d) {
            d3.select(this)
                .style("stroke", "black")
                .style("fill", colors.green)
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style("stroke", "none")
                .style("fill", "none")
        })
        .append("title")
        .html(function (d) { return d.tooltipContent });


    d3.selectAll('g.tick')
        //only ticks that returned true for the filter will be included
        //in the rest of the method calls:
        .select('line') //grab the tick line
        .attr('class', 'quadrantBorder') //style with a custom class and CSS
        .style('stroke-width', 0.1); //or style directly with attributes or inline styles


    function onMouseEnter(event, datum) {
        const barY = yScale(datum.value) + margin.top + margin.bottom;
        const barX = xScale(datum.date) + margin.left + margin.right;

        tooltip
            .select("#count")
            .text(datum.value);

        tooltip
            .style('transform', `translate(calc(-50% +${barX}px), calc(-100% + ${barY}px))`)
        tooltip
            .style('opacity', 1)
    }

    function onMouseLeave(event, datum) {

        tooltip.style("opacity", 0);
    }
}