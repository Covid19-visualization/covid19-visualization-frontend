/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { fetchHandler } from '../../../utils/fetchHandler';
import { API } from '../../../utils/API';
import { countries_colors } from '../../../utils/utility';
import { MyBarChartVaccinations, MyBarChartDeaths } from './Drawer';
import { CONST } from "../../../utils/const";

import './BarChart.css';


function BarChart(props) {

    const { europeData, selectedCountriesData, selectedPeriod, selectedCountries } = useContext(Context);
    
    useEffect(() => {
        if(selectedCountries.length != 0){
            let data = {
                ...selectedPeriod,
                selectedCountries: selectedCountries
            }
            fetchHandler(data, API.METHOD.POST, API.GET_PEOPLE_VACCINATED, createBarData) 
        }
        else{
            if(europeData.barData != null)
                createBarData([europeData.barData])
        }
    }, [europeData, selectedCountriesData]);

    function createBarData(selectedData) {
        var resData = []
        if(selectedData[0] != null){
            selectedData.forEach(data => {
                var entryData = {}
                entryData["group"] = data.name;
                entryData["people_fully_vaccinated"] = Math.floor((data.people_fully_vaccinated * 100) / data.population);
                entryData["people_vaccinated"] = Math.floor((data.people_vaccinated * 100) / data.population) - entryData["people_fully_vaccinated"];
                entryData["deaths"] = (data.total_deaths * 100) / data.population
                entryData["deaths2"] = (data.total_deaths * 100) / data.total_cases - entryData["deaths"]
                entryData["cases"] = (parseInt(data.total_cases) * 100) / data.population - entryData["deaths2"] - entryData["deaths"];
                resData.push(entryData);
            })
        }
        drawChart(resData);
    }

    function drawChart(data) {

        var cfg = {
            w: 500,
            h: 310,
            lw: 250,
            lh: 250,
            standard_opacity: 0.4,
            full_opacity: 0.8,
            colorSelection: ["#0B9B6F", "#034F34"],
            color: countries_colors
        };
        if(data.length != 0 && props.type == CONST.CHART_TYPE.VACCINATIONS){
            cfg["colorSelection"] =  ["#0B9B6F", "#034F34"];
            cfg["legendOptions"] = ["2 doses", "1 dose"];
            MyBarChartVaccinations.draw("#bar_container", data, cfg);
        }
        else if(data.length != 0 && props.type == CONST.CHART_TYPE.DEATHS){
            cfg["colorSelection"] =  ["red", "brown", "#ff6666"];
            cfg["legendOptions"] = ["deaths/pop", "deaths/posit", "cases"];
            MyBarChartDeaths.draw("#bar_container", data, cfg);
        }
        else{
            MyBarChartDeaths.draw("#bar_container", [], cfg);
        }
    }

    return(
        <div>
            <div id="tooltipbarchart" className="tooltipbarchart">
                <div className="tooltipbarchart-value">
                    <span id="value"></span>
                </div>
            </div>
            <div id="bar_container" />
        </div>
    );
}

export default BarChart;