/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import LineChart from "../../components/Graphs/LineChart/LineChart";
import RadarChart from "../../components/Graphs/RadarChart/RadarChart";
import TableChart from "../../components/Graphs/TableChart/TableChart";
import PcaChart from "../../components/Graphs/PcaChart/PcaChart";

import { Context } from "../../context/Provider";
import { CONST } from "../../utils/const";
import { regenerateData, } from "../../utils/utility";
import "./Cases.css";
import GeoData from "../Europe.geo.json";
import GeoChart from "../../components/Graphs/GeoChart/GeoChart";


const Cases = () => {

    const debug = false;
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
    const { selectedCountries } = useContext(Context);

    return (
        <>
            <div className={"vaccination-container"} style={{ width: "100%", height: "100%", display: "flex", backgroundColor: debug ? "beige" : null }} >
                <div className={"first-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "blue" : null }} >
                        <GeoChart data={GeoData} type={CONST.CHART_TYPE.CASES} innerHeight={innerHeight} innerWidth={innerWidth} />
                    </div>

                    <div className={"second-component"} style={{ width: "100%", height: "40%", backgroundColor: debug ? "brown" : null }} >
                        <LineChart type={CONST.CHART_TYPE.CASES} innerHeight={innerHeight} innerWidth={innerWidth} />
                    </div>
                </div>
                <div className={"second-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "yellow" : null, justifyContent: "center", alignItems: "center"}}>
                        <div className={"top-half"} style={{ width: "100%", height: "70%", backgroundColor: debug ? "azure" : null, justifyContent: "center", alignItems: "center" }}>
                            <RadarChart type={CONST.CHART_TYPE.CASES} innerHeight={innerHeight} innerWidth={innerWidth}/>
                        </div>
                        <div className={"bottom-half"} style={{ width: "100%", height: "30%", backgroundColor: debug ? "grey" : null, justifyContent: "center", alignItems: "center" }}>
                            <TableChart type={CONST.CHART_TYPE.CASES} />
                        </div>
                    </div>
                    <div className={"second-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "purple" : null }}>
                        <PcaChart innerHeight={innerHeight} innerWidth={innerWidth} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cases;
