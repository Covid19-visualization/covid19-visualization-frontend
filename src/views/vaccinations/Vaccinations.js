/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import LineChart from "../../components/Graphs/LineChart/LineChart";
import GeoChart from "../../components/Graphs/GeoChart/GeoChart";
import TableChart from "../../components/Graphs/TableChart/TableChart";
import BarChart from "../../components/Graphs/BarChart/BarChart";
import PcaChart from "../../components/Graphs/PcaChart/PcaChart";
import ParalChart from "../../components/Graphs/ParalChart/ParalChart";

import { Context } from "../../context/Provider";
import { regenerateData } from "../../utils/utility";
import GeoData from "../Europe.geo.json";
import { CONST } from "../../utils/const";
import "./Vaccinations.css";

  
const Vaccinations = () => {

    const debug = false;
    //const data = regenerateData();
    //const data2 = regenerateData();
    //const [props] = useState("total_vaccinations");
    const { selectedCountries } = useContext(Context);
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;

    return (
        <>
            <div className={"vaccination-container"} style={{ width: "100%", height: "100%", display: "flex", backgroundColor: debug ? "beige" : null }} >
            
                <div className={"first-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "blue" : null }}>
                        <canvas id="my_dataviz" width="583" height="100"></canvas>
                        <GeoChart data={GeoData} type={CONST.CHART_TYPE.VACCINATIONS} width = {200} height = {100} />
                    </div>
                    <div className={"second-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "brown" : null, justifyContent: "center", alignItems: "center" }}>
                        <LineChart type={CONST.CHART_TYPE.VACCINATIONS} innerHeight={innerHeight} innerWidth={innerWidth} />
                    </div>
                </div>
                <div className={"second-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "100%", backgroundColor: debug ? "yellow" : null, justifyContent: "center", alignItems: "center"}}>
                        <div className={"top-half"} style={{ width: "100%", height: "25%", backgroundColor: debug ? "azure" : null, justifyContent: "center", alignItems: "center" }}>
                            <TableChart type={CONST.CHART_TYPE.VACCINATIONS} />
                        </div>
                        <div className={"bottom-half"} style={{ width: "100%", height: "35%", backgroundColor: debug ? "grey" : null, justifyContent: "center", alignItems: "center" }}>
                            <div className={"half1"} style={{ width: "50%%", height: "0%", backgroundColor: debug ? "orange" : null, justifyContent: "center", alignItems: "center" }}>
                                <PcaChart type={CONST.CHART_TYPE.VACCINATIONS} innerHeight={innerHeight} innerWidth={innerWidth} />
                            </div>
                            <div className={"half2"} style={{ width: "50%", height: "0%", backgroundColor: debug ? "black" : null, justifyContent: "center", alignItems: "center" }}>
                                {/*<RadarChart type={CONST.CHART_TYPE.VACCINATIONS} innerHeight={innerHeight} innerWidth={innerWidth}/>*/}
                                <ParalChart type={CONST.CHART_TYPE.VACCINATIONS} innerHeight={innerHeight} innerWidth={innerWidth}/>
                            </div>
                        </div>
                        <div className={"second-component"} style={{ width: "100%", height: "40%%", backgroundColor: debug ? "purple" : null }}>
                            <BarChart type={CONST.CHART_TYPE.VACCINATIONS} innerHeight={innerHeight} innerWidth={innerWidth}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Vaccinations;
