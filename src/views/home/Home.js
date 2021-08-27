import React, { useState, useEffect, useContext } from "react";
import "./Home.css";


const Home = () => {

    const height = window.innerHeight;
    const width = window.innerWidth;

    return (
        <>
            <div className="container" >
                <div className="container_graph" style={{ borderRadius: 5, padding: 10 }}>

                </div>
            </div>
        </>
    );
}

export default Home;
