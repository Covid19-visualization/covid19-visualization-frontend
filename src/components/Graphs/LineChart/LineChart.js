/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { CONST } from '../../../utils/const';
import { drawChart } from './newDrawer';
import './LineChart.css';


function LineChart(props) {
    const { width, height, type } = props;

    const { europeData, selectedCountriesData, selectedPeriod } = useContext(Context);

    useEffect(() => {
        var europeFiltered = type == CONST.CHART_TYPE.VACCINATIONS ? europeData.vaccinations : europeData.cases;
        var selectedCountriesFiltered = type == CONST.CHART_TYPE.VACCINATIONS ? selectedCountriesData.vaccinations : selectedCountriesData.cases;

        if (europeFiltered.length > 0 || selectedCountriesFiltered.length > 0) {
            drawChart(europeFiltered, [selectedCountriesFiltered], width, height);
        }

    }, [selectedCountriesData])


    return (
        <div id="graph-wrapper">
            <div id="tooltiplinechart" class="tooltiplinechart">
                <div class="tooltiplinechart-date">
                    <span id="date"></span>
                </div>
                <div class="tooltiplinechart-value">
                    <span id="value"></span>
                </div>
            </div>
            <div id="line_container" className="svg-container" />
        </div>
    );
}

export default LineChart;

