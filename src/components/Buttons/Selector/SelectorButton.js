import React, { useState, useEffect, useContext } from "react";
import { colors } from "../../../utils/colors";
import "./SelectorButton.css";
import { Context } from "../../../context/Provider";

const SelectorButton = (props) => {
    const { countries } = useContext(Context);

    const height = props.height;
    const width = props.width;
    const type = props.type;
    const onClick = props.onClick;

    const [hover, setHover] = useState(false)
    const [className, setClassName] = useState("selector-group")
    const [showEuropeData, setShowEuropeData] = useState(true)

    function toggleBlockVisible() {
        // showEuropeData 
        //     ? hover 
        //         ? setClassName(CLASS_NAMES.SHOW_EUROPE_DATA.HOVERED)
        //         : setClassName(CLASS_NAMES.SHOW_EUROPE_DATA.NORMAL)
        //     : hover
        //         ? setClassName(CLASS_NAMES.NO_EUROPE_DATA.HOVERED)
        //         : setClassName(CLASS_NAMES.NO_EUROPE_DATA.NORMAL)

        // setHover(!hover);
    }

    function handleClick() {
        let aux = !showEuropeData

        if(aux) {
            setClassName(() => CLASS_NAMES.SHOW_EUROPE_DATA.NORMAL)
            onClick(true);
        }
        else {
            setClassName(() => CLASS_NAMES.NO_EUROPE_DATA.NORMAL)
            onClick(false);
        }
        setShowEuropeData(() => aux);
    }


    return (
        <>
            <div>
                <div
                    className={className}
                    style={closedBlock}
                    onMouseEnter={toggleBlockVisible}
                    onMouseLeave={toggleBlockVisible}
                    onMouseDown={handleClick}
                >
                    {type.name}
                </div>
            </div>

        </>
    );
}

export default SelectorButton;

const closedBlock = {
    backgroundColor: colors.black,

}

const CLASS_NAMES = {
    SHOW_EUROPE_DATA: {
        NORMAL: "selector-group unselectable",
        HOVERED: "selector-group hover unselectable"
    },
    NO_EUROPE_DATA: {
        NORMAL: "selector-group-no-data unselectable",
        HOVERED: "selector-group-no-data hover unselectable"
    },
}
