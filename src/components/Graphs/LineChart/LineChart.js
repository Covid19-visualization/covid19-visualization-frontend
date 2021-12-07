/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { CONST } from '../../../utils/const';
import { drawChart } from './Drawer';
import SelectorButton from '../../../components/Buttons/Selector/SelectorButton';
import './LineChart.css';
import { compositionDependencies } from 'mathjs';
import { colors } from '../../../utils/colors';
import {computeDim } from '../../../utils/utility';


function LineChart(props) {
    const { innerWidth, innerHeight, type } = props;

    var width = 600, height=300;

    var dim = computeDim(width, height, innerWidth, innerHeight);

    const { europeData, selectedCountriesDataByName } = useContext(Context);
    const europePath = {
        id: CONST.EUROPE.ID,
        name: "Europe",
        color: colors.europeBlue,
    }
    const [showEuropeData, setShowEuropeData] = useState(true)

    useEffect(() => {
        var europeFiltered = type == CONST.CHART_TYPE.VACCINATIONS ? europeData.vaccinations : europeData.cases;

        if (europeFiltered.length > 0) {
            drawChart(europeFiltered, europeData.deaths, selectedCountriesDataByName, dim[0], dim[1], type, showEuropeData);
        }

    }, [selectedCountriesDataByName, showEuropeData]);

    function handleShowEuropeData(isVisible) {
        console.log(isVisible);
        setShowEuropeData(() => isVisible);
    }

    return (
        <div>
            <SelectorButton type={europePath} onClick={handleShowEuropeData} />
            <div id="graph-wrapper">
                <div id="tooltiplinechart" className="tooltiplinechart">
                    <div className="tooltiplinechart-date">
                        <span id="date"></span>
                    </div>
                    <div className="tooltiplinechart-value">
                        <span id="value"></span>
                    </div>
                </div>
                <div id="line_container" className="svg-container" />
            </div>
        </div>

    );
}

export default LineChart;

