import React, { useState, useEffect, useContext } from "react";
import { colors } from "../../utils/colors";
import "./SearchBar.css";
import CountryList from "./CountryList";
import { Context } from "../../context/Provider";

const SearchBar = (props) => {
    const { countries } = useContext(Context);

    const height = props.height;
    const width = props.width;
    const visible = props.visible;

    const [filteredList, setFilteredList] = useState(countries)
    const [blockVisible, setBlockVisible] = useState(false)

    useEffect(() => {
        setFilteredList(countries)

    }, [countries])



    function toggleBlockVisible() {
        setBlockVisible(!blockVisible);
    }

    function handleInputChange(event) {
        let string = event.target.value.toLowerCase();
        if (string.length == 0) setFilteredList(countries);
        else {
            setFilteredList(countries.filter((item) => item.name.toLowerCase().includes(string)));
        }
    }

    return (
        <>
            <div style={!visible ? { display: 'none', marginTop: '5px' } : { marginTop: '5px' }}>
                <div className="input-group" style={blockVisible ? openBlock : closedBlock} onMouseEnter={toggleBlockVisible} onMouseLeave={toggleBlockVisible}  >
                    <i className="fas fa-search" />
                    <input type="text" className="input-field" onInput={handleInputChange} />
                    {blockVisible ? <CountryList list={filteredList.length > 0 ? filteredList : []} /> : null}

                </div>
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

