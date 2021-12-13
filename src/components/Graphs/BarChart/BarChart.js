/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { fetchHandler } from '../../../utils/fetchHandler';
import { API } from '../../../utils/API';
import { countries_colors, computeDim } from '../../../utils/utility';
import { MyBarChart } from './Drawer';
import { CONST } from "../../../utils/const";

import './BarChart.css';


function BarChart(props) {

    const {type, innerHeight, innerWidth} = props;

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
                entryData["total_boosters"] = Math.floor((data.total_boosters * 100) / data.population)
                entryData["people_fully_vaccinated"] = Math.floor((data.people_fully_vaccinated * 100) / data.population) - entryData["total_boosters"];
                entryData["people_vaccinated"] = Math.floor((data.people_vaccinated * 100) / data.population) - entryData["people_fully_vaccinated"] - entryData["total_boosters"];
                entryData["deaths"] = (data.total_deaths * 100) / data.population
                entryData["deaths2"] = (data.total_deaths * 100) / data.total_cases - entryData["deaths"]
                entryData["cases"] = (parseInt(data.total_cases) * 100) / data.population - entryData["deaths2"] - entryData["deaths"];
                entryData["cases2"] = (parseInt(data.total_cases) * 100) / data.population - entryData["deaths"];
                entryData["stringency_index"] = data.stringency_index - entryData["deaths"] - entryData["cases2"];
                resData.push(entryData);
            })
        }
        drawChart(resData);
    }

    function drawChart(data) {

        var dim = computeDim(500, 310, innerWidth, innerHeight)
        var w = dim[0], h = dim[1];
        
        var cfg = {
            innerHeight: innerHeight,
            innerWidth: innerWidth,
            w: w,
            h: h,
            lw: computeDim(250, 250, innerWidth, innerHeight)[0],
            lh: computeDim(230, 250, innerWidth, innerHeight)[1],
            standard_opacity: 0.4,
            full_opacity: 0.8,
            colorSelection: ["#0B9B6F", "#034F34"],
            color: countries_colors,
            props:props
        };
        if(data.length != 0 && props.type == CONST.CHART_TYPE.VACCINATIONS){
            cfg["colorSelection"] =  ["green", "#0B9B6F", "#034F34"];
            cfg["legendOptions"] = ["Booster dose", "Second dose", "First dose"];
            cfg["subgroups"] = ["total_boosters", "people_fully_vaccinated", "people_vaccinated"];
            cfg["type"] = 0;
            MyBarChart.draw("#bar_container", data, cfg);
        }
        else if(data.length != 0 && props.type == CONST.CHART_TYPE.DEATHS){
            cfg["colorSelection"] =  ["red", "brown", "#ff6666"];
            cfg["legendOptions"] = ["Deaths", "Deaths/Cases", "Cases"];
            cfg["subgroups"] = ["deaths", "deaths2", "cases"];
            cfg["type"] = 1;
            MyBarChart.draw("#bar_container", data, cfg);
        }
        else{
            cfg["colorSelection"] =  ["black", "#1E90FF", "blue"];
            cfg["legendOptions"] = ["Deaths", "Cases", "Stringency Index"];
            cfg["subgroups"] = ["deaths", "cases2", "stringency_index"];
            cfg["type"] = 2;
            MyBarChart.draw("#bar_container", data, cfg);
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