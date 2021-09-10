import React, { useContext, useEffect, useState } from 'react';
import * as d3 from 'd3'
import { colors } from '../../../utils/colors'
import './LineChart.css';
import { Context } from '../../../context/Provider';
import { regenerateData } from '../../../utils/utility';

function LineChart(props) {
    const { width, height } = props;

    const { selectedPeriod } = useContext(Context);
    const [labeledData, setLabeledData] = useState([regenerateData(selectedPeriod.from, selectedPeriod.to)])
    const [unlabeledData, setUnlabeledData] = useState([regenerateData(selectedPeriod.from, selectedPeriod.to)])

    const margin = { top: 50, right: 50, bottom: 50, left: 100 };

    useEffect(() => {

        let labeled = regenerateData(selectedPeriod.from, selectedPeriod.to)
        let unlabeled = regenerateData(selectedPeriod.from, selectedPeriod.to)

        setLabeledData(...labeled);
        setUnlabeledData(...unlabeled);

        drawChart(labeled, unlabeled);
    }, [selectedPeriod])



    function drawChart(labeledData, unlabeledData) {


        const xScale = d3.scaleTime()
            .nice()
            .domain(d3.extent(labeledData, d => d.date))
            .range([margin.left, width - margin.right])

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(labeledData, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top])

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
            .attr("fill", "none")
            .attr("stroke", colors.green)
            .attr("stroke-width", 3)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        svg.append("path")
            .datum(unlabeledData)
            .attr("fill", "none")
            .attr("stroke", colors.azure)
            .attr("stroke-width", 3)
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

    return <svg className="svg-canvas" />;
}

export default LineChart;