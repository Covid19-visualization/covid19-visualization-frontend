/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import LineChart from "../../components/Graphs/LineChart/LineChart";
import RadarChart from "../../components/Graphs/RadarChart/RadarChart";
import TableChart from "../../components/Graphs/TableChart/TableChart";
import BarChart from "../../components/Graphs/BarChart/BarChart";

import { CONST } from "../../utils/const";
import "./Deaths.css";

const Deaths = () => {

    const debug = false;


    return (
        <>
            <div className={"death-container"} style={{ width: "100%", height: "100%", display: "flex", backgroundColor: debug ? "beige" : null }} >
                <div className={"first-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "blue" : null }}>
                    </div>
                    <div className={"second-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "brown" : null, justifyContent: "center", alignItems: "center" }}>
                        <LineChart width={600} height={300} type={CONST.CHART_TYPE.DEATHS} />
                    </div>
                </div>
                <div className={"second-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "yellow" : null, justifyContent: "center", alignItems: "center" }}>
                        <div className={"top-half"} style={{ width: "100%", height: "70%", backgroundColor: debug ? "azure" : null, justifyContent: "center", alignItems: "center" }}>
                             <RadarChart type={CONST.CHART_TYPE.VACCINATIONS} /> 
                        </div>
                        <div className={"bottom-half"} style={{ width: "100%", height: "30%", backgroundColor: debug ? "grey" : null, justifyContent: "center", alignItems: "center" }}>
                             <TableChart type={CONST.CHART_TYPE.VACCINATIONS} /> 
                        </div>
                    </div>
                    <div className={"second-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "purple" : null }}>
                        <BarChart type={CONST.CHART_TYPE.DEATHS}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Deaths;
