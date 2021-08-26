import CountryItem from "./CountryItem";
import "./CountryList.css"


const CountryList = (props) => {
    const list = [
        { name: "Italy", population: "60093422", cases: "4313543" },
        { name: "Germany", population: "83093492", cases: "5313543" },
        { name: "France", population: "75093482", cases: "6313543" },
        { name: "UK", population: "68096482", cases: "4452543" }
    ]

    return (
        <>
            <ul className="country-list">
                {list.map((item) => {
                    return <CountryItem
                        name={item.name}
                        population={item.population}
                        cases={item.cases} />
                })}
            </ul>
        </>
    );
}

export default CountryList;

