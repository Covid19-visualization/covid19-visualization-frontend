import React, { useState, useEffect, useContext } from "react";
import BarChart from "../../components/Graphs/BarChart/BarChart";
import LineChart from "../../components/Graphs/LineChart/LineChart";
import RadarChart from "../../components/Graphs/RadarChart/RadarChart";

import { Context } from "../../context/Provider";
import { regenerateData } from "../../utils/utility";
import "./Vaccinations.css";

const Vaccinations = () => {

    const debug = false;
    const height = window.innerHeight;
    const width = window.innerWidth;
    const { selectedCountries } = useContext(Context);

    const data = regenerateData();
    const data2 = regenerateData();




    const data3 = [
        [//iPhone
          {axis:"Battery Life",value:0.22},
          {axis:"Brand",value:0.28},
          {axis:"Contract Cost",value:0.29},
          {axis:"Design And Quality",value:0.17},
          {axis:"Have Internet Connectivity",value:0.22},
          {axis:"Large Screen",value:0.02},
          {axis:"Price Of Device",value:0.21},
          {axis:"To Be A Smartphone",value:0.50}			
        ],[//Samsung
          {axis:"Battery Life",value:0.27},
          {axis:"Brand",value:0.16},
          {axis:"Contract Cost",value:0.35},
          {axis:"Design And Quality",value:0.13},
          {axis:"Have Internet Connectivity",value:0.20},
          {axis:"Large Screen",value:0.13},
          {axis:"Price Of Device",value:0.35},
          {axis:"To Be A Smartphone",value:0.38}
        ],[//Nokia Smartphone
          {axis:"Battery Life",value:0.26},
          {axis:"Brand",value:0.10},
          {axis:"Contract Cost",value:0.30},
          {axis:"Design And Quality",value:0.14},
          {axis:"Have Internet Connectivity",value:0.22},
          {axis:"Large Screen",value:0.04},
          {axis:"Price Of Device",value:0.41},
          {axis:"To Be A Smartphone",value:0.30}
        ]
      ];
    
    var margin = {top: 100, right: 100, bottom: 100, left: 100};

    var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
      };


    
    return (
        <>
            <div className={"vaccination-container"} style={{ width: "100%", height: "100%", display: "flex", backgroundColor: debug ? "beige" : null }} >
                <div className={"first-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "60%", backgroundColor: debug ? "blue" : null }} />
                    <div className={"second-component"} style={{ width: "100%", height: "40%", backgroundColor: debug ? "brown" : null }} />
                      <RadarChart id={".radarChart"} data={data3} options={radarChartOptions} />
                </div>
                <div className={"second-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "yellow" : null, justifyContent: "center", alignItems: "center" }}>
                        <LineChart labeledData={data} unlabeledData={data2} width={550} height={200} />
                    </div>
                    <div className={"second-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "purple" : null }} />
                </div>

                {/* <BarChart data={data} /> */}

            </div>
        </>
    );
}

export default Vaccinations;
