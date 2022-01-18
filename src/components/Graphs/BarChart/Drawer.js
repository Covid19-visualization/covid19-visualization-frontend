/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import * as d3 from 'd3';
import './BarChart.css';
import {computeDim, onClick, onMouseOut } from '../../../utils/utility';


export const MyBarChart = {
    draw: function(id, data, cfg, setSelectedCountry, isClicked){
        d3.select(id).select("svg").remove();

        const margin = {top: 30, right: 30, bottom: 20, left: 50};
        const tooltip = d3.select("#tooltipbarchart");
        var max = cfg.type != 0 ? getMaxPerc(data, cfg.type) + 1 : 100;

        // append the svg object to the body of the page
        var svg = d3.select(id)
        .append("svg")
        .attr("width", cfg.w*2 + margin.left + margin.right)
        .attr("height", cfg.h + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
                
        // List of subgroups = header of the csv files = soil condition here
        var subgroups = cfg.subgroups

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function(d){return(d.group)})

        
        ///////// Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, cfg.w])
            .padding(0.4)
        svg.append("g")
            .attr("transform", "translate(0," + cfg.h + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        ////////// Add Y axis
        var y = d3.scaleLinear()
            .domain([0, max])
            .range([ cfg.h, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        ////////// Stack the data --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)
        
        ////////// Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d, i) { return cfg.colorSelection[i]; })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("id", function(d) {
                    var idx = d.data.group.replace(/\s/g, "")
                    return `rect${idx}`; 
                })
                .attr("x", function(d) { return x(d.data.group); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth())
                .attr("text", function(d) {return d[1]})

                .on('click', function(e, d){
                    if(!isClicked){
                        setSelectedCountry(d.data.group)
                        onClick(d.data.group.replace(/\s/g, ""), cfg);
                        isClicked = true;
                    }
                    else{
                        setSelectedCountry(null)
                        onMouseOut(d.data.group.replace(/\s/g, ""), cfg);
                        isClicked = false;
                    }
                })

                .on('mouseover', function (event, d){
                    const mousePosition = d3.pointer(event);

                    var proportion = computeDim(830, 580, cfg.props.innerWidth, cfg.props.innerHeight)

                    var X = mousePosition[0] + proportion[0]
                    var Y = mousePosition[1] + proportion[1]

                    tooltip.style("transform", `translate(calc( -50% + ${X}px), calc(-100% + ${Y}px))`)
                    tooltip.select("#value").html(generateTooltipText(d, cfg));
                    tooltip
                        .style('opacity', 1)
                })

                .on('mouseout', function(){
                    tooltip
                        .style('opacity', 0)
                })

        generateLegend(id, cfg);
    }  
}

function generateLegend(id, cfg){
    //Legend titles
    var LegendOptions = cfg.legendOptions

    var svgl = d3.select(id)
    .selectAll('svg')
    .append('g')
    .attr("width", cfg.lw)
    .attr("height", cfg.lh)

    //Create the title for the legend
    var text = svgl.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(90,10)') 
        .attr("x", computeDim(460, 20, cfg.innerWidth, cfg.innerHeight)[0]) // cfg.w 
        .attr("y", computeDim(460, 20, cfg.innerWidth, cfg.innerHeight)[1]) // cfg.h
        .attr("font-size", "15px")
        .attr("fill", "#404040")
        .text("Legend:");
            
    if(LegendOptions != null){
        //Initiate Legend	
        var legend = svgl.append("g")
            .attr("class", "legend")
            .attr('transform', 'translate(90,-20)') ;
        
        //Create colour squares
        legend.selectAll('circle')
        .data(LegendOptions).enter()
        .append("circle")
        .attr("cx", cfg.lw + computeDim(220, 20, cfg.innerWidth, cfg.innerHeight)[0])
        .attr("cy", function(d, i){ return 75 + (i * 20);})
        .attr("id", function(d){return d})
        .attr("r", 5)
        .style("fill", function(d, i){ return cfg.colorSelection[i]; });
    
        //Create text next to squares
        legend.selectAll('text')
            .data(LegendOptions).enter()
            .append("text")
            .attr("x", cfg.lw + computeDim(230, 20, cfg.innerWidth, cfg.innerHeight)[0])
            .attr("y", function(d, i){ return 70 + (i * 20 + 9);})
            .attr("font-size", "12px")
            .attr("fill", "#737373")
            .text(function(d) { return d });  
    }
}

function generateTooltipText(d, cfg){
    var Format = d3.format('.3');
    var tooltipText = ''
    if(cfg.type == 0){
        tooltipText = `<h3 style='color: ${cfg.color[d.data.group]}'>${d.data.group}</h3>` + 
            `<a style='color: ${cfg.colorSelection[2]}'">People with <b>1 dose</b> of vaccine: </a>${d.data.people_fully_vaccinated + d.data.people_vaccinated + d.data.total_boosters}%` +
            "<br>" + 
            `<a style='color: ${cfg.colorSelection[1]}'">People with <b>2 doses</b> of vaccine: </a>${d.data.people_fully_vaccinated + d.data.total_boosters}%` + 
            "<br>" + 
            `<a style='color: ${cfg.colorSelection[0]}'">People with <b>Booster doses</b>: </a>${d.data.total_boosters}%`
    }
    else if(cfg.type == 1){
        tooltipText = `<h3 style='color: ${cfg.color[d.data.group]}'>${d.data.group}</h3>` + 
            `<a style='color: ${cfg.colorSelection[2]}'">Share of <b>positives</b>/population: </a>${Format(d.data.deaths + d.data.cases + d.data.deaths2)}%` +
            "<br>" + 
            `<a style='color: ${cfg.colorSelection[1]}'">Share of <b>deaths</b>/positives: </a>${Format(d.data.deaths2 + d.data.deaths)}%` +
            "<br>" + 
            `<a style='color: ${cfg.colorSelection[0]}'">Share of <b>deaths</b>/population: </a>${Format(d.data.deaths)}%`;
    }
    else{
        tooltipText = `<h3 style='color: ${cfg.color[d.data.group]}'>${d.data.group}</h3>` + 
            `<a style='color: ${cfg.colorSelection[2]}'">Stringency index: </a>${Format(d.data.stringency_index + d.data.deaths + d.data.cases2)}%` +
            "<br>" + 
            `<a style='color: ${cfg.colorSelection[1]}'">Share of <b>positives</b>: </a>${Format(d.data.deaths + d.data.cases2)}%` +
            "<br>" + 
            `<a style='color: ${cfg.colorSelection[0]}'">Share of <b>deaths</b>: </a>${Format(d.data.deaths)}%` ;
    }
    return tooltipText;
}

function getMaxPerc(data, type){
    var max = 0;
    if(type == 1){
        data.forEach(country =>{
            var temp = Math.floor(country.deaths + country.cases + country.deaths2)
            if(temp > max) max = temp;
        })
        return max = max > 0 ? max : 8
    }
    else if(type == 2){
        data.forEach(country =>{
            var temp = Math.floor(country.deaths + country.cases2 + country.stringency_index)
            if(temp > max) max = temp;
        })
        return max = max > 0 ? max : 8
    }
}