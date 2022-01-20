/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from "react";
import FlagButton from "../../components/Buttons/flag/FlagButton";
import { Context } from "../../context/Provider";
import { CONST } from "../../utils/const";
import Cases from "../cases/Cases";
import Vaccinations from "../vaccinations/Vaccinations";
import Deaths from "../deaths/Deaths";
import "./Home.css";
import { fetchHandler } from '../../utils/fetchHandler';
import { API } from "../../utils/API";
import { parseData } from "../../utils/utility";
import { countries_colors } from "../../utils/colors";
import * as d3 from 'd3'


const Home = () => {
    const { selectedPeriod, selectedCountries, isCasesVisualization, setEuropeData, setSelectedCountriesData, setSelectedCountriesDataByName } = useContext(Context);

    useEffect(() => {
        let data = {
            ...selectedPeriod,
            selectedCountries: selectedCountries
        }
        fetchHandler(data, API.METHOD.POST, API.GET_SELECTED_COUNTRIES_DATA, regenerateData);
    }, [selectedCountries, selectedPeriod])

    function regenerateData(newData) {
        let parsedData = parseData(selectedPeriod.from, selectedPeriod.to, newData)
        setCountriesColors(parsedData.selectedCountriesDataByName)
        setEuropeData(parsedData.europeData);
        setSelectedCountriesData(parsedData.selectedCountriesData);
        setSelectedCountriesDataByName(parsedData.selectedCountriesDataByName);
    }

    function setCountriesColors(data){
        var series = 0;
        var colors = d3.scaleOrdinal(d3.schemeCategory10);
        data.forEach(country => {
            countries_colors[country.id] = colors(series);
            series++;
        })
    }


    return (
        <>
            <div className="container" >
                <div className="container_selected_countries">
                    {selectedCountries.length > 0
                        ? selectedCountries.map((item, index) => {
                            return <FlagButton height={40} width={40} marginBottom={5} flagIcon={item} type={CONST.FLAG_BUTTON.TYPE.SIDE} key={item + index} />
                        })
                        : null
                    }

                </div>
                <div className="container_graph" style={{ borderRadius: 5, padding: 0 }}>
                    {isCasesVisualization > 0 ? (isCasesVisualization > 1 ? <Deaths /> : <Vaccinations /> ) : <Cases />}
                </div>
            </div>
        </>
    );
}

export default Home;
