import React, { useContext, useEffect, useState } from 'react';
import * as d3 from 'd3'
import { colors } from '../../../utils/colors'
import './LineChart.css';
import { Context } from '../../../context/Provider';
import { refreshData, differenceBetweenDays } from '../../../utils/utility';
import { CONST } from '../../../utils/const';
import { fetchHandler } from '../../../utils/fetchHandler';
import { API } from '../../../utils/API';


function LineChart(props) {
    const { width, height, type} = props;

    const { selectedPeriod, selectedCountries, selectedCountriesData } = useContext(Context);
    const [labeledData, setLabeledData] = useState([])
/*     const [unlabeledData, setUnlabeledData] = useState([regenerateData(selectedPeriod.from, selectedPeriod.to)])
 */
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };

    useEffect(() => {
        let data = {
            ...selectedPeriod,
            selectedCountries: selectedCountries
        }

        fetchHandler(data, API.METHOD.POST, API.GET_SELECTED_COUNTRY_DATA, regenerateData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPeriod, selectedCountries])

    function regenerateData(newData) {

        const selectedCountriesDataAux = refreshData(selectedPeriod.from, selectedPeriod.to, newData, type)
        drawChart(selectedCountriesDataAux);
    }


    function drawChart(labeledData) {

        const xScale = generateScaleX(labeledData, margin, width)

        const yScale = generateScaleY(labeledData, height, margin)

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
            .datum(labeledData)
            .sort()
            .attr("fill", "none")
            .attr("stroke", colors.green)
            .attr("stroke-width", lineWidth())
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

/*         svg.append("path")
            .datum(unlabeledData)
            .attr("fill", "none")
            .attr("stroke", colors.azure)
            .attr("stroke-width", lineWidth())
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);
 */
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


function generateScaleY(labeledData, height, margin) {
    return d3.scaleLinear()
        .domain([0, d3.max(labeledData, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);
}

function generateScaleX(labeledData, margin, width) {
    return d3.scaleTime()
        .nice()
        .domain(d3.extent(labeledData, d => d.date))
        .range([margin.left, width - margin.right]);
}

