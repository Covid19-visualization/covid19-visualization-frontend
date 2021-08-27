import { useContext } from "react";
import Loader from "react-loader-spinner";
import { Context } from "../../context/Provider";
import { colors } from "../../utils/colors";
import CountryItem from "./CountryItem";
import "./CountryList.css"


const CountryList = (props) => {

    const context = useContext(Context);

    const list = context.countries

    return (
        <>
            <ul className="country-list">
                {list
                    ? list.map((item) => {
                        return <CountryItem
                            name={item.name}
                            population={item.population}
                            cases={item.cases ? item.cases : 0} />
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

