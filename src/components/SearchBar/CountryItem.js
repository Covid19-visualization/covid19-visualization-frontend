import "./CountryItem.css"
import FlagButton from "../../components/Buttons/flag/FlagButton";
const CountryItem = (props) => {

    const population = props.population;
    const cases = props.cases;
    const name = props.name;
    const milion = 1000000;
    return (
        <div>
            <ul className="line-wrapper">
                <li className="line-element" style={{margin: 4}}>
                    <FlagButton height={30} width={30} flagIcon={name.toLowerCase()} />
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

