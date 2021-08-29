import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Provider";
import "./Cases.css";

const Cases = () => {

    const height = window.innerHeight;
    const width = window.innerWidth;
    const { selectedCountries } = useContext(Context);

    return (
        <>
            <div className={"cases-container"} style={{ width: "100%", height: "100%" }} >

            </div>
        </>
    );
}

export default Cases;
