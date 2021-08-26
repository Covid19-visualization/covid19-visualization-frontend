import React, { useState } from "react";
import './FlagButton.css';

const FlagButton = (props) => {

    const height = props.height;
    const width = props.width;
    const flagIcon = props.flagIcon;

    const [touched, setTouched] = useState(false);

    const toggleTouched = () => {
        setTouched(!touched);
    }

    const handleMouseUp = () => {
        // Handle smooth animation when clicking without holding
        setTimeout(() => {
            setTouched(!touched);
        }, 150);
    }


    return (
        <div
            className={touched ? "flag_icon touched" : "flag icon"}
            onMouseDown={toggleTouched}
            onMouseUp={handleMouseUp}
        >
            <img
                style={{
                    borderRadius: "50%",
                    width: width,
                    height: height,
                    display: "block",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "auto",
                    objectFit: "cover",
                    border: "2px solid #1C1B1B"
                }}
                src={`images/${flagIcon}.png`}
                alt="logo"
            />
        </div>
    );
}

export default FlagButton;