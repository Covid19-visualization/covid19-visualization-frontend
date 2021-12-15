/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import * as d3 from 'd3';
import "./PcaChart.css";
import {computeDim} from '../../../utils/utility';
import { prettyCounterHandler } from '../../../utils/utility'
import { CONST } from '../../../utils/const';


export const MyPcaChart = {
    draw: function(id, data, legendOptions, cfg){
        const margin = {top: 40, right: 10, bottom: 0, left: 390};

        d3.select(id).select("svg").remove();
        var FormatLong = (a) => prettyCounterHandler(a, CONST.COUNTER_HANDLER.LONG)

        // append the svg object to the body of the page
        var svg = d3.select(id)
                    .append("svg")
                    .attr("width", cfg.w)
                    .attr("height", cfg.h)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

        //Tooltip
        var tooltip = svg.append('text')
                .style('opacity', 0)
                .style('font-family', 'sans-serif')
                .style('font-size', '13px');

        // Add X axis
        var x = d3.scaleLinear()
            .domain([cfg.min_x, cfg.max_x])
            .range([ 0, cfg.range_w ]);

        svg.append("g")
            .attr("transform", "translate(0," + cfg.range_h + ")")
            .call(
                d3.axisBottom(x)
                .tickFormat(function(d, i) {return i % 2 === 0 ? FormatLong(d) : null;})
            );

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([cfg.min_y, cfg.max_y])
            .range([ cfg.range_h, 0]);

        svg.append("g")
            .call(
                d3.axisLeft(y)
                .tickFormat(function(d, i) {return i % 2 === 0 ? FormatLong(d) : null;})
            );

        // Add dots
        data.forEach(c => {
            svg.append('g')
            .selectAll("dot")
            .data(c.pca).enter()
            .append("circle")
            .attr("id", (c.country).replace(/\s/g, ""))
            .attr("valuex", function (d) { return d[0] } )
            .attr("valuey", function (d) { return d[1] } )
            .attr("cx", function (d) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 3)
            .style("fill", cfg.color[c.country])

            .on('mouseover', function (d){
                d3.select(this).attr("r", 6)
                tooltip
                    .attr('x', parseFloat(d3.select(this).attr('cx')) + 10)
                    .attr('y', parseFloat(d3.select(this).attr('cy')))
                    .text("("+d3.select(this).attr("valuex") + ", " + d3.select(this).attr("valuey")+")")
                    .transition(200)
                    .style('opacity', 1);
        
            })
            .on('mouseout', function(){ 
                d3.select(this).attr("r", 3) 
                tooltip
                    .transition(200)
                    .style('opacity', 0);
            
            });
        });
    }
}

export const dbLabelStatic = [
    "population",
    "total_cases",
    "population_density",
    "median_age",
    "gdp_per_capita",
    "cardiovasc_death_rate",
    "diabetes_prevalence",
    "female_smokers",
    "male_smokers",
    "life_expectancy",
    "human_development_index"
]

export const dbLabelDaily = [
    "new_cases",
    "new_cases_smoothed",
    "total_deaths",
    "new_deaths",
    "new_deaths_smoothed",
    "stringency_index",
    "new_vaccinations_smoothed",
    "people_fully_vaccinated",
    "people_vaccinated",
    "total_boosters"
]