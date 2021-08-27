import React, { useState, useEffect, useContext } from "react";
import FlagButton from "../../components/Buttons/flag/FlagButton";
import { Context } from "../../context/Provider";
import { CONST } from "../../utils/const";
import "./Home.css";

const Home = () => {

    const height = window.innerHeight;
    const width = window.innerWidth;
    const { selectedCountries } = useContext(Context);

    return (
        <>
            <div className="container" >
                <div className="container_selected_countries">
                    {selectedCountries.map((item) => {
                        return <FlagButton height={40} width={40} marginBottom={5} flagIcon={item} type={CONST.FLAG_BUTTON.TYPE.SIDE} />
                    })}
                </div>
                <div className="container_graph" style={{ borderRadius: 5, padding: 10 }}>

                </div>
            </div>
        </>
    );
}

export default Home;
