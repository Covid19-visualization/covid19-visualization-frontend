import React, { useEffect } from 'react';
import * as d3 from 'd3'
import { colors } from '../../../utils/colors'
import './LineChart.css';

function LineChart(props) {
    const { labeledData, unlabeledData, width, height } = props;


    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const yMinValue = d3.min(labeledData, d => d.value);
    const yMaxValue = d3.max(labeledData, d => d.value);
    const xMinValue = d3.min(labeledData, d => d.label);
    const xMaxValue = d3.max(labeledData, d => d.label);

    useEffect(() => {
        drawChart();
    }, []);

    function drawChart() {
        let svg = d3
            .select('#container')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        let tooltip = d3
            .select('#container')
            .append('div')
            .attr('class', 'tooltip')

        let xScale = d3
            .scaleLinear()
            .domain([xMinValue, xMaxValue])
            .range([0, width]);

        let yScale = d3
            .scaleLinear()
            .range([height, 0])
            .domain([0, yMaxValue]);

        let line = d3
            .line()
            .x(d => xScale(d.label))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom().scale(xScale).tickSize(15));
        svg
            .append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));


        svg
            .append('path')
            .datum(labeledData)
            .attr('fill', 'none')
            .attr('stroke', colors.green)
            .attr('stroke-width', 5)
            .attr('class', 'line')
            .attr('d', line);
        svg
            .append('path')
            .datum(unlabeledData)
            .attr('fill', 'none')
            .attr('stroke', colors.azure)
            .attr('stroke-width', 5)
            .attr('class', 'line')
            .attr('d', line);

        let focusLabeled = svg
            .append('g')
            .attr('class', 'focus')
            .style('display', 'none');

        focusLabeled.append('circle')
            .attr('r', 5)
            .attr('class', 'circle')
            .style("fill", colors.green)
            .style("stroke", "black");


        let focusUnlabeled = svg
            .append('g')
            .attr('class', 'focus')
            .style('display', 'none');

        focusUnlabeled.append('circle')
            .attr('r', 5)
            .attr('class', 'circle')
            .style("fill", colors.azure)
            .style("stroke", "black");

        tooltip = d3
            .select('#container')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        svg
            .append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .style('opacity', 0)
            .on('mouseover', () => {
                focusLabeled.style('display', null);
                focusUnlabeled.style('display', null)
                focusLabeled
                    .transition()
                    .duration(300)
                    .style('opacity', 1);
                focusUnlabeled
                    .transition()
                    .duration(300)
                    .style('opacity', 1);
            })
            .on('mouseout', () => {
                tooltip
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
                focusLabeled
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
                focusUnlabeled
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
            })
            .on('mousemove', mousemove);



        function mousemove(event) {
            const bisect = d3.bisector(d => d.label).left;

            const xPos = d3.pointer(event)[0];
            const x0_labeled = bisect(labeledData, xScale.invert(xPos));
            const x0_unlabeled = bisect(unlabeledData, xScale.invert(xPos));

            const d0_labeled = labeledData[x0_labeled > 0 ? x0_labeled - 1 : x0_labeled];
            const d0_unlabeled = unlabeledData[x0_unlabeled > 0 ? x0_unlabeled - 1 : x0_unlabeled];

            focusLabeled.attr(
                'transform',
                `translate(${xScale(d0_labeled.label)},${yScale(d0_labeled.value)})`,
            );

            focusUnlabeled.attr(
                'transform',
                `translate(${xScale(d0_unlabeled.label)},${yScale(d0_unlabeled.value)})`,
            );

        }
    }
    return <div id="container" />;
}

export default LineChart;