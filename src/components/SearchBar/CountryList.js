import "./CountryList.css"

const CountryList = (props) => {
    const list = [
        { name: "Italy" },
        { name: "Germany" },
        { name: "France" },
        { name: "UK" }
    ]

    return (
        <>
            <ul className="country-list">
                {list.map((item) => {
                    return <li className="country-item">{item.name}</li>
                })}
            </ul>
        </>
    );
}

export default CountryList;

