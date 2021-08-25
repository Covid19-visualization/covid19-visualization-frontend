import React, { useState, useEffect } from "react";
import { colors } from "../../utils/colors";
import "./SearchBar.css";
import CountryList from "./CountryList";

const SearchBar = (props) => {
    const height = props.height;
    const width = props.width;

    const [blockVisible, setBlockVisible] = useState(false)

    function toggleBlockVisible() {
        setBlockVisible(!blockVisible);
    }

    return (
        <>
            <div className="input-group" style={blockVisible ? openBlock : closedBlock} onMouseEnter={toggleBlockVisible} onMouseLeave={toggleBlockVisible} >
                <i className="fas fa-search" />
                <input type="text" className="input-field" />
                {blockVisible ? <CountryList/>: null}
            </div>
        </>
    );
}

export default SearchBar;

const openBlock = {
    marginTop: "170px",
    width: "300px",
    height: "205px",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    padding: "5px",
}
const closedBlock = {
    width: "300px",
    minHeight: "35px",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: "5px",

}