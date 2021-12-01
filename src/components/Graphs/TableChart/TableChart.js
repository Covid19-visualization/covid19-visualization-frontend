/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Provider';
import { MyTableChart } from './Drawer';
import { countries_colors } from '../../../utils/utility';
import "./TableChart.css"

function TableChart(props) {

    const { europeData, selectedCountriesDataByName } = useContext(Context);

    useEffect(() => {
        drawChart(europeData, selectedCountriesDataByName); 
    }, [europeData, selectedCountriesDataByName]);

    function drawChart(europeData, data) {

        var cfg = {
            w: 400,
            h: 200,
            standard_opacity: 0.4,
            full_opacity: 0.8,
            color: countries_colors,
            colorSelection: ["#292b2c", "#3399ff"],
            type: props.type
        };
    
        if(data != null && data.length != 0){
            MyTableChart.draw("#table_container", data, cfg);
        }
        else if(europeData.radarData != null && europeData.radarData.length != 0){
            europeData["id"] = "Europe";
            MyTableChart.draw("#table_container", [europeData], cfg);
        }
        else{
            MyTableChart.clean("#table_container");
        }
    }
    return <div className="card" id="table_container" />;

}
export default TableChart;