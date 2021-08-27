import "./CountryItem.css"
import FlagButton from "../../components/Buttons/flag/FlagButton";
import { useContext, useState } from "react";
import { Context } from "../../context/Provider";
import { CONST } from "../../utils/const";

const CountryItem = (props) => {

    const {selectedCountries, setSelectedCountries} = useContext(Context);
    const population = props.population;
    const cases = props.cases;
    const name = props.name;
    const milion = 1000000;


    const handleCountrySelection = () => {
        let selectionAux = selectedCountries;
        let selected = selectedCountries.includes(name);

        if(!selected) {
            selectionAux.push(name)
            setSelectedCountries([...selectionAux])
        }
        else {
            setSelectedCountries([...selectionAux.filter((country) => country != name)])
        }

    }

    return (
        <div>
            <ul className="line-wrapper" onClick={handleCountrySelection}>
                <li className="line-element" style={{ margin: 4 }}>
                    <FlagButton height={30} width={30} flagIcon={name ? name.toLowerCase() : "europe"}/>
                </li>
                <li className="line-element">
                    <ul className="country-wrapper">
                        <li className="country-name">{name}</li>
                        <li className="country-info">
                            <p className="country-info">
                                {(population / milion).toFixed(1)}M - {(cases / milion).toFixed(1)}M cases
                            </p>
                        </li>
                    </ul>
                </li>
            </ul>
            <hr />
        </div>
    );
}

export default CountryItem;

