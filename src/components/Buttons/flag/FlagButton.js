import React, { useContext, useState } from "react";
import { Context } from "../../../context/Provider";
import { CONST } from "../../../utils/const";
import './FlagButton.css';

const FlagButton = (props) => {
    const { selectedCountries, setSelectedCountries } = useContext(Context);

    const height = props.height;
    const width = props.width;
    const flagIcon = props.flagIcon;
    const type = props.type;
    const marginBottom = props.marginBottom;

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

    const removeCountry = () => {
        let selectionAux = selectedCountries;
        setSelectedCountries([...selectionAux.filter((country) => country != flagIcon)])

    }

    return (
        <div
            className={touched && type != CONST.FLAG_BUTTON.TYPE.SEARCH ? "flag_icon touched" : "flag icon"}
            onMouseEnter={toggleTouched}
            onMouseLeave={toggleTouched}
            style={marginBottom ? { marginBottom: marginBottom } : {}}
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
            {type == CONST.FLAG_BUTTON.TYPE.SIDE
                ? <div className="cancel-selection"><i class="fas fa-times" onClick={removeCountry} style={{textShadow: "0px 0px 3px #1C1B1B", color: 'white', }}></i> </div>
                : null}
        </div>
    );
}

export default FlagButton;