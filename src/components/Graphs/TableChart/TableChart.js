import React, { useEffect } from 'react';
import * as d3 from 'd3'
//import './TableChart.css';

function TableChart(props) {

    const margin = { top: 50, right: 50, bottom: 1000, left: 600 };

    const d = props.data;
    
    useEffect(() => {
        drawChart();
    }, []);

    function drawChart() {
        var w = 230, h = 230;

        //Options for the Radar chart, other than default
        var cfg = {
            w: w,
            h: h,
            maxValue: 0.6,
            levels: 6,
            ExtraWidthX: 300
        }

        d3.json('./data.json', function (error,data) {

            function tabulate(data, columns) {
                var table = d3.select('#container3').append('table')
                var thead = table.append('thead')
                var	tbody = table.append('tbody');
        
                // append the header row
                thead.append('tr')
                .selectAll('th')
                .data(columns).enter()
                .append('th')
                    .text(function (column) { return column; });
        
                // create a row for each object in the data
                var rows = tbody.selectAll('tr')
                .data(data)
                .enter()
                .append('tr');
        
                // create a cell in each row for each column
                var cells = rows.selectAll('td')
                .data(function (row) {
                    return columns.map(function (column) {
                    return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append('td')
                    .text(function (d) { return d.value; });
          
                return table;
              }
          
              // render the table(s)
              tabulate(data, ['date', 'close']); // 2 column table    
          });
    }
    return <div id="container3" />;
	
}

export default TableChart;