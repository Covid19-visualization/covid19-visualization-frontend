/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import {countries_colors } from '../../../utils/utility';
import { CONST } from '../../../utils/const';
import { MyRadarChart } from './Drawer';


import "./RadarChart.css"

function RadarChart(props) {

    const type = props.type;

    const { europeData, selectedCountriesDataByName } = useContext(Context);
    
    useEffect(() => { 
        drawChart(europeData, selectedCountriesDataByName);
    }, [europeData, selectedCountriesDataByName])
    

    function drawChart(europeData, countriesData) {
        var w = 250, h = 250;

        //Options for the Radar chart, other than default
        var cfg = {
            radius: 5,
            w: w,
            h: h,
            factor: 1,
            factorLegend: .85,
            levels: 5,
            maxValue: 100,
            radians: 2 * Math.PI,
            opacityArea: 0.4,
            ToRight: 5,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: countries_colors
        };
        
        var radarData = []

        if(countriesData != null && countriesData.length != 0){
            radarData = generateRadarData(countriesData, type);
            var countries = generateLegendOptions(countriesData)
            MyRadarChart.draw("#container2", radarData, cfg, countries);
        }
        else if (europeData.radarData != null && europeData.radarData.length != 0){
            radarData = generateRadarData([europeData], type);
            MyRadarChart.draw("#container2", radarData, cfg, ["Europe"]);
        }
    }

    function generateRadarData(data, type){
        var radarData = [];
    
        if(type == CONST.CHART_TYPE.VACCINATIONS){
            data.forEach(country  => {
                var newData = []
                newData.push({axis: "Population density / 10", value: country.radarData.population_density / 10})
                newData.push({axis: "Life Expect", value: country.radarData.life_expectancy})
                newData.push({axis: "GDP per Capita / 1000", value: country.radarData.gdp_per_capita / 1000})
                newData.push({axis: "Median age", value: country.radarData.median_age})
                newData.push({axis: "HDI", value: country.radarData.human_development_index * 100})
    
                radarData.push(newData);
            });
        }
        else{
            data.forEach(country  => {
                var newData = []
                newData.push({axis: "Population density / 10", value: country.radarData.population_density / 10})
                newData.push({axis: "Smokers", value: country.radarData.male_smokers + country.radarData.female_smokers})
                newData.push({axis: "Cardiovasc death rate / 10", value: country.radarData.cardiovasc_death_rate / 5})
                newData.push({axis: "Diabetes prevalence", value: country.radarData.diabetes_prevalence })
                newData.push({axis: "Median age", value: country.radarData.median_age})
    
                radarData.push(newData);
            });
        }
        
        return radarData;
    }
    
    
    function generateLegendOptions(data){
        var countries = [];
        
        data.forEach(country  => {
            countries.push(country.id);
        });
        
        return countries;
    }

    return <div  id="container2" />;
	
}

export default RadarChart;