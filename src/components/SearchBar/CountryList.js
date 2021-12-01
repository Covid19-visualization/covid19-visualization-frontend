/* eslint-disable no-unused-vars */
import { useContext } from "react";
import Loader from "react-loader-spinner";
import { Context } from "../../context/Provider";
import { colors } from "../../utils/colors";
import CountryItem from "./CountryItem";
import "./CountryList.css"


const CountryList = (props) => {

    const list = props.list;
    return (
        <>
            <ul className="country-list">
                {list
                    ? list.map((item) => {
                        return <CountryItem
                            name={item.name}
                            population={item.population}
                            cases={item.total_cases ? item.total_cases : 0}
                            key={`${item.name}_${Date.now()}`} />
                    })
                    : <Loader
                        type="Rings"
                        color={colors.darkGray}
                        height={50}
                        width={50}
                        timeout={3000} //3 secs
                    />}
            </ul>
        </>
    );
}

export default CountryList;

