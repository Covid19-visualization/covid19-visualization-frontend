import React, { useState, useEffect, useContext } from "react";
import BarChart from "../../components/Graphs/BarChart/BarChart";
import LineChart from "../../components/Graphs/LineChart/LineChart";
import GeoChart from "../../components/Graphs/GeoChart/GeoChart";
import { Context } from "../../context/Provider";
import { regenerateData } from "../../utils/utility";
import GeoData from "./Europe.geo.json";
import SunburstChart from "../../components/Graphs/SunburstChart/SunburstChart";
import "./Vaccinations.css";

  
const Vaccinations = () => {

    const debug = false;
    const height = window.innerHeight;
    const width = window.innerWidth;
    const { selectedCountries } = useContext(Context);

    const data = regenerateData();
    const data2 = regenerateData();
    const [property] = useState("pop_est");


    return (
        <>
            <div className={"vaccination-container"} style={{ width: "100%", height: "100%", display: "flex", backgroundColor: debug ? "beige" : null }} >
            
                <div className={"first-half-container"} style={{ width: "50%", height: "100%", backgroundColor: debug ? "green" : null, flex: 0.5 }}>
                
                    <div className={"first-component"} style={{ width: "100%", height: "50%", backgroundColor: debug ? "blue" : null }} >
                        <GeoChart data={GeoData} property={property} />
                    </div>
                    <div className={"second-component"} style={{ width: "50%", height: "50%", backgroundColor: debug ? "brown" : null }} >
                        <SunburstChart />
                    </div>
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
