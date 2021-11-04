import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Provider";
import { CONST } from "../../utils/const";
import RadarChart from "../../components/Graphs/RadarChart/RadarChart";
import TableChart from "../../components/Graphs/TableChart/TableChart";
import SunburstChart from "../../components/Graphs/SunburstChart/SunburstChart";
import "./Cases.css";


const Cases = () => {

    const debug = false;
    const height = window.innerHeight;
    const width = window.innerWidth;
    const { selectedCountries } = useContext(Context);

    return (
        <>
            <div className={"cases-container"} style={{ width: "100%", height: "100%", display: "flex", backgroundColor: debug ? "beige" : null }} >
                <div className={"first-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "60%", backgroundColor: debug ? "blue" : null }} />
                    <div className={"second-component"} style={{ width: "100%", height: "40%", backgroundColor: debug ? "brown" : null }} />
                </div>
                <div className={"second-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "yellow" : null, justifyContent: "center", alignItems: "center" }}>
                        <RadarChart type={CONST.CHART_TYPE.CASES} />
                        <TableChart type={CONST.CHART_TYPE.CASES}/> 
                    </div>
                    <div className={"second-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "purple" : null }} >
                        <SunburstChart/> 
                    </div>
                </div>

            </div>
        </>
    );
}

export default Cases;
