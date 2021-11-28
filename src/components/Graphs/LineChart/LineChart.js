/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { CONST } from '../../../utils/const';
import { drawChart } from './newDrawer';
import SelectorButton from '../../../components/Buttons/Selector/SelectorButton';
import './LineChart.css';
import { compositionDependencies } from 'mathjs';
import { colors } from '../../../utils/colors';

function LineChart(props) {
    const { width, height, type } = props;

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
            drawChart(europeFiltered, europeData.deaths, selectedCountriesDataByName, width, height, type, showEuropeData);
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
        </div>

    );
}

export default LineChart;

