import { useContext } from "react";
import { Context } from "../../context/Provider";
import CountryItem from "./CountryItem";
import "./CountryList.css"


const CountryList = (props) => {

    const context = useContext(Context);


    const list = context.countries

    return (
        <>
            <ul className="country-list">
                {list.map((item) => {
                    return <CountryItem
                        name={item.name}
                        population={item.population}
                        cases={item.cases? item.cases : 0} />
                })}
            </ul>
        </>
    );
}

export default CountryList;

