/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import FlagButton from "../../components/Buttons/flag/FlagButton";
import { Context } from "../../context/Provider";
import { CONST } from "../../utils/const";
import Cases from "../cases/Cases";
import Vaccinations from "../vaccinations/Vaccinations";
import "./Home.css";
import { fetchHandler } from '../../utils/fetchHandler';
import { API } from "../../utils/API";
import { parseData } from "../../utils/utility";

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
        setEuropeData(parsedData.europeData);
        setSelectedCountriesData(parsedData.selectedCountriesData);
        setSelectedCountriesDataByName(parsedData.selectedCountriesDataByName);
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
                    {isCasesVisualization ? <Cases /> : <Vaccinations />}
                </div>
            </div>
        </>
    );
}

export default Home;
