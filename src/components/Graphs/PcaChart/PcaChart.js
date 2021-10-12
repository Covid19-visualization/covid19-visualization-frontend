/*
import React, { useEffect } from 'react';
import * as d3 from 'd3'

function PcaChart(props) {

    const d = props.data;

    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = 550 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    var X = d3.scale.linear().range([0, width]);

    var Y = d3.scale.linear().range([height, 0]);


    var svg = d3.select("#pca_container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var numSamplesPerFrame = 200,
        numSamples = 0;

    var xdata = [], ydata = [];
    var x_mean, y_mean;
    var data, eigs;

    
    // Event binding
    d3.selectAll("input[name=ax]")
        .data([[true, true], [false, false], [true, false], [false, true]])
        .on("change", function(d) {
        move(d[0], d[1]);
        });
    

    // Draw the normal axes
    var components = svg.selectAll("line")
            .data([
                [[0.0, 0.5], [1, 0.5], "X"],
                [[0.5, 0.0], [0.5, 1], "Y"],
            ], function(d, i){return d[2];});

    components.exit().remove();
    components.enter().append('line')
        .attr('class', 'ax')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .attr('x1', function (d) { return X(d[0][0]); })
        .attr('y1', function (d) { return Y(d[0][1]); })
        .attr('x2', function (d) { return X(d[1][0]); })
        .attr('y2', function (d) { return Y(d[1][1]); });

    function covariance(x_adjust, y_adjust, n){
        var total = 0;
        for (var i = 0; i < x_adjust.length; i++) {
            total += x_adjust[i] * y_adjust[i];
        }
        return total / (n-1);
    }

    function solve() {
        var n = xdata.length;
        x_mean = xdata.reduce(function (memo, num) {
            return memo + num;
        }, 0) / n;
        y_mean = ydata.reduce(function (memo, num) {
            return memo + num;
        }, 0) / n;

        // Subtract the mean
        var x_adjust = xdata.map(function (num) {
            return num - x_mean;
        });
        var y_adjust = ydata.map(function (num) {
            return num - y_mean;
        });
        data = [y_adjust, x_adjust];

        // Calculate the covariance
        var xyc = covariance(x_adjust, y_adjust, n);
        var xxc = covariance(x_adjust, x_adjust, n);
        var yyc = covariance(y_adjust, y_adjust, n);

        var covar = [ [xxc, xyc], [xyc, yyc] ];
        d3.selectAll('#covar').html(numeric.prettyPrint(covar));

        // Calculate the eigen vectors
        var eig = numeric.eig(covar);
        eigs = eig.E.x;
        var eigelements = d3.select("#eigvects").selectAll("div").data(eigs);
        eigelements.enter().append('div')
                .html(function(d){return numeric.prettyPrint(d)});

    }

    function plotEigVects(){
        // Plot eigen vectors centered at the mean
        var components = svg.selectAll("line.pca")
                .data([
                    [
                        [x_mean, y_mean],
                        [x_mean + eigs[0][1], y_mean + eigs[0][0]],
                        "Y"
                    ],
                    [
                        [x_mean, y_mean],
                        [x_mean + eigs[1][1], y_mean + eigs[1][0]],
                        "X"
                    ]
                ], function(d){return d[2];});
        components.enter().append('line')
                .attr('stroke', 'red')
                .attr('stroke-width', '2px')
                .attr("class", 'pca');
        components
                .transition().ease("linear").duration(2000)
                .attr('x1', function (d) { return X(d[0][0]); })
                .attr('y1', function (d) { return Y(d[0][1]); })
                .attr('x2', function (d) { return X(d[1][0]); })
                .attr('y2', function (d) { return Y(d[1][1]); });

    }

    function move(useFirst, useSecond){

        // Form a feature vector
        var featureVectorRow = [];
        if(useFirst){
            featureVectorRow.push(eigs[0]);
        }
        if(useSecond){
            featureVectorRow.push(eigs[1]);
        }

        if(!useFirst && !useSecond){
            // plot the original data
            plotOriginal();
            plotEigVects();
            return;
        }


        var finalData = numeric.transpose(numeric.dot(featureVectorRow, data));


        var n = xdata.length;
        // Move the axis lines to normal positions
        var components = svg.selectAll("line.pca")
                .data([
                    [[0.5, 0.5], [1, 0.5], "X"],
                    [[0.5, 0.5], [0.5, 1], "Y"],
                ], function(d, i){return d[2];});

        components.exit().remove();
        components.enter().append('line');


        // plot the new lower dimensional data
        var circle = svg.selectAll("circle");
        //.data(finalData, function(d, i){ return d;});

        circle
            .transition().ease("linear").duration(2000)
            .attr('cx', function(d, i){
                    if(useFirst && useSecond) {
                        return X(0.5 + finalData[i][1]);
                    }
                    if(useSecond) {
                        return X(0.5 + finalData[i][0]);
                    }
                    if (useFirst){
                        return X(0.5);//X(i/n);
                    }
                })
            .attr('cy', function(d, i){
                if(useFirst && useSecond) {
                    return Y(0.5 + finalData[i][0]);
                }
                if (useFirst){
                    return Y(0.5 + finalData[i][0]);
                }
                if (useSecond){
                    return Y(0.5);
                }

                });


        components
            .transition().ease("linear").duration(2000)
            .attr('x1', function (d) { return X(d[0][0]); })
            .attr('y1', function (d) { return Y(d[0][1]); })
            .attr('x2', function (d) { return X(d[1][0]); })
            .attr('y2', function (d) { return Y(d[1][1]); });
    }

    function plotOriginal(){
        var xycoords = numeric.transpose([xdata, ydata]);
        var circle = svg.selectAll("circle")
        .data(xycoords, function(d, i) { return d; });

        circle.enter().append("circle")
            .attr("r", 2)
            .attr("fill", 'steelblue');

        circle
            .transition().ease("linear").duration(2000)
            .attr("cx", function(d, i) { return X(d[0]); })
            .attr("cy", function(d, i){return Y(d[1]);});

        circle.exit().remove();
    }


    function createData() {
        eigs = [];
        xdata = [];
        ydata = [];
        numSamples = 0;

        var amean = parseFloat(document.getElementById('amean').value);
        var astd = parseFloat(document.getElementById('astd').value);
        var bmean = parseFloat(document.getElementById('bmean').value);
        var bstd = parseFloat(document.getElementById('bstd').value);


        var ax = parseFloat(document.getElementById('ax').value);
        var ay = parseFloat(document.getElementById('ay').value);
        var bx = parseFloat(document.getElementById('bx').value);
        var by = parseFloat(document.getElementById('by').value);

        d3.timer(function () {
            for (var i = 0; i < numSamplesPerFrame; ++i) {
                var a = rnd(amean, astd),
                    b = rnd(bmean, bstd);

                var x = ax * a + bx * b,
                    y = ay * a + by * b;

                xdata.push(x);
                ydata.push(y);

            }

            plotOriginal();

            if (++numSamples > 10) {
                solve();
                plotEigVects();
                return true;
            }
        });
    }

    createData();
    
    
    useEffect(() => {
        drawChart();
    }, []);

    function drawChart() {
    
    }
    return <div id="pca_container"/>;
	
}

export default PcaChart;
*/