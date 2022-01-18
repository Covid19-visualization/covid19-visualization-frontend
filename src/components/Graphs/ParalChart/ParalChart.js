/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { computeDim } from '../../../utils/utility';
import { countries_colors } from '../../../utils/colors';
import { CONST } from '../../../utils/const';
import { MyParalChart } from './Drawer';


import "./ParalChart.css"

function ParalChart(props) {

    const {type, innerHeight, innerWidth} = props;

    const { europeData, selectedCountriesDataByName } = useContext(Context);
    
    useEffect(() => { 
        drawChart(europeData, selectedCountriesDataByName);
    }, [europeData, selectedCountriesDataByName])

    function drawChart(europeData, countriesData) {

        var dim = computeDim(470, 200, innerWidth, innerHeight)
        var w = dim[0], h = dim[1];


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
            MyParalChart.draw("#paral_container", radarData, cfg, countries);
        }
        else if (europeData.radarData != null && europeData.radarData.length != 0){
            radarData = generateRadarData([europeData], type);
            MyParalChart.draw("#paral_container", radarData, cfg, ["Europe"]);
        }
    }

    function generateRadarData(data, type){
        var radarData = [];

        console.log(data)
        if(type == CONST.CHART_TYPE.VACCINATIONS){
            radarData[0] = ["Pop density", "Life Expect",  "GDP per Capita", "Human Develop Idx", "Age", "Countries"]
            data.forEach(country  => {
                radarData.push({"Pop density": country.radarData.population_density,
                            "Life Expect": country.radarData.life_expectancy,
                            "GDP per Capita": country.radarData.gdp_per_capita,
                            "Human Develop Idx": country.radarData.human_development_index,
                            "Age": country.radarData.median_age,
                            "Countries":country.id,
                });
            });
        }
        else{
            radarData[0] = ["Pop density", "Smokers", "Life Expect",  "Card death rate", "Diab preval", "Age", "Countries"]
            data.forEach(country  => {
                radarData.push({"Pop density": country.radarData.population_density,
                            "Smokers": country.radarData.male_smokers + country.radarData.female_smokers,
                            "Life Expect": country.radarData.life_expectancy,
                            "Card death rate": country.radarData.cardiovasc_death_rate,
                            "Diab preval": country.radarData.diabetes_prevalence,
                            "Age": country.radarData.median_age,
                            "Countries":country.id,
                });
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

    return <div  id="paral_container" />;
	
}

export default ParalChart;