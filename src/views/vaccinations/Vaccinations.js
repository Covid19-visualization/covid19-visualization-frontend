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

    var data4 = [
      [
          {axis: "strength", value: 13, yOffset: 10},
          {axis: "intelligence", value: 6},
          {axis: "charisma", value: 5},  
          {axis: "dexterity", value: 9},  
          {axis: "luck", value: 2, xOffset: -20}
        ],
        [
          {axis: "strength", value: 6},
          {axis: "intelligence", value: 7},
          {axis: "charisma", value: 10},  
          {axis: "dexterity", value: 13},  
          {axis: "luck", value: 9}
        ]
    ];
    //Data
    var data3 = [
      [
          {axis:"Email",value:0.59},
          {axis:"Social Networks",value:0.56},
          {axis:"Internet Banking",value:0.42},
          {axis:"News Sportsites",value:0.34},
          {axis:"Search Engine",value:0.48},
          {axis:"View Shopping sites",value:0.14},
          {axis:"Paying Online",value:0.11},
          {axis:"Buy Online",value:0.05},
          {axis:"Stream Music",value:0.07},
          {axis:"Online Gaming",value:0.12},
          {axis:"Navigation",value:0.27},
          {axis:"App connected to TV program",value:0.03},
          {axis:"Offline Gaming",value:0.12},
          {axis:"Photo Video",value:0.4},
          {axis:"Reading",value:0.03},
          {axis:"Listen Music",value:0.22},
          {axis:"Watch TV",value:0.03},
          {axis:"TV Movies Streaming",value:0.03},
          {axis:"Listen Radio",value:0.07},
          {axis:"Sending Money",value:0.18},
          {axis:"Other",value:0.07},
          {axis:"Use less Once week",value:0.08}
      ],[
          {axis:"Email",value:0.48},
          {axis:"Social Networks",value:0.41},
          {axis:"Internet Banking",value:0.27},
          {axis:"News Sportsites",value:0.28},
          {axis:"Search Engine",value:0.46},
          {axis:"View Shopping sites",value:0.29},
          {axis:"Paying Online",value:0.11},
          {axis:"Buy Online",value:0.14},
          {axis:"Stream Music",value:0.05},
          {axis:"Online Gaming",value:0.19},
          {axis:"Navigation",value:0.14},
          {axis:"App connected to TV program",value:0.06},
          {axis:"Offline Gaming",value:0.24},
          {axis:"Photo Video",value:0.17},
          {axis:"Reading",value:0.15},
          {axis:"Listen Music",value:0.12},
          {axis:"Watch TV",value:0.1},
          {axis:"TV Movies Streaming",value:0.14},
          {axis:"Listen Radio",value:0.06},
          {axis:"Sending Money",value:0.16},
          {axis:"Other",value:0.07},
          {axis:"Use less Once week",value:0.17}
      ]
      ];
        
    return (
        <>
            <div className={"vaccination-container"} style={{ width: "100%", height: "100%", display: "flex", backgroundColor: debug ? "beige" : null }} >
                <div className={"first-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                    <div className={"first-component"} style={{ width: "100%", height: "60%", backgroundColor: debug ? "blue" : null }} />
                    <RadarChart data={data4} />
                    <div className={"second-component"} style={{ width: "100%", height: "40%", backgroundColor: debug ? "brown" : null }} />
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
