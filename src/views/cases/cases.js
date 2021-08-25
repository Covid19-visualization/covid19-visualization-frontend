import React,  { useState, useEffect } from "react";
import "./cases.css";

const Cases = () => {
    const height= window.innerHeight;
    const width= window.innerWidth;

    return (
        <>
            <div className="container" >
                <div className="container_graph" style={{borderRadius: 5}}></div>
            </div>
        </>
    );
}

export default Cases;
