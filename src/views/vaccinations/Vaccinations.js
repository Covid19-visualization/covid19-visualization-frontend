import React, { useState, useEffect, useContext } from "react";
import LineChart from "../../components/Graphs/LineChart/LineChart";
import RadarChart from "../../components/Graphs/RadarChart/RadarChart";
import TableChart from "../../components/Graphs/TableChart/TableChart";
import PcaChart from "../../components/Graphs/PcaChart/PcaChart";

import { Context } from "../../context/Provider";
import { CONST } from "../../utils/const";
import { regenerateData, } from "../../utils/utility";
import "./Vaccinations.css";

const Vaccinations = () => {

    const debug = false;
    const height = window.innerHeight;
    const width = window.innerWidth;
    const { selectedCountries } = useContext(Context);
        


    return (
        <>
            <div className={"vaccination-container"} style={{ width: "100%", height: "100%", display: "flex", backgroundColor: debug ? "beige" : null }} >
                <div className={"first-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "60%", backgroundColor: debug ? "blue" : null }}>
                    </div>
                    <div className={"second-component"} style={{ width: "100%", height: "40%", backgroundColor: debug ? "brown" : null }}>
                        <LineChart width={500} height={200} type={CONST.CHART_TYPE.VACCINATIONS} />
                    </div>
                </div>
                <div className={"second-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "yellow" : null, justifyContent: "center", alignItems: "center" }}>
                        <RadarChart type={CONST.CHART_TYPE.VACCINATIONS} />
                        <TableChart type={CONST.CHART_TYPE.VACCINATIONS}/> 
                    </div>
                    <div className={"second-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "purple" : null }}>
                        <PcaChart type={CONST.CHART_TYPE.VACCINATIONS}/>
                    </div>
                </div>

                {/* <BarChart data={data} /> */}

            </div>
        </>
    );
}

export default Vaccinations;
