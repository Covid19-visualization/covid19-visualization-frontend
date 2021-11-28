import { CONST } from "./const";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function DateHandler(from, to) {

    return `${visualizeDate(from)} - ${visualizeDate(to)} `;
    /* return from == to
     ? `${from.getDay()} ${shortMonthName[from.getMonth()]} ${to.getFullYear()} - ${to.getDay()} ${shortMonthName[to.getMonth()]} ${to.getFullYear()}`
     : `${from.getDay()} ${shortMonthName[from.getMonth()]} ${to.getFullYear()}` */
}

export function visualizeDate(date) {
    let shortMonthName = months.map((item) => { return item.substr(0, 3) })

    return `${addZeros(date)} ${shortMonthName[date.getMonth()]} ${date.getFullYear()}`;
}

function addZeros(date) {
    return date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
}

export function getLastPeriod(year, month, day) {

    var today = new Date();
    let dayOfTheMonth = today.getDate() - day <= 0 ? new Date(today.getYear(), today.getMonth() - 1, 0).getDate() - (day - today.getDate()) : today.getDate() - day
    let fixedMonth = today.getDate() - day <= 0 ? today.getMonth() - month : today.getMonth() + 1 - month

    return new Date(`${today.getFullYear() - year}-${fixedMonth}-${dayOfTheMonth}`);
}

export function differenceBetweenDays(from, to) {

    const utc1 = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const utc2 = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());

    return Math.floor((utc2 - utc1) / CONST.MS_PER_DAY);
}

export function prettyCounterHandler(counter, type) {
    return type === CONST.COUNTER_HANDLER.LONG
        ? (counter / CONST.MILION).toFixed(1) >= 1 ? (counter / CONST.MILION).toFixed(1) + " M" : (counter / CONST.THOUSAND).toFixed(1) + " k"
        : (counter / CONST.MILION).toFixed(1) >= 1 ? (counter / CONST.MILION).toFixed(1) + "M" : (counter / CONST.THOUSAND).toFixed(1) + "k"
}

export function parseData(from, to, data) {
    let europeData = {}, selectedCountriesData = {}, selectedCountriesDataByName = [];

    data.forEach(element => {
        let dailyDataList = element.dailyData;
        var vaccinations = [], cases = [], deaths = [], radarData = [], countries = [];

        dailyDataList.forEach(data => {
            let currentDay = new Date(data._id);
            let id = data._id;

            if (element._id === CONST.SELECTED_COUNTRIES_BY_NAME.ID) {
                currentDay = new Date(id.date);
                
                if (!countries.includes(id.name)) {
                    selectedCountriesDataByName.push({ id: id.name, cases: [], vaccinations: [] })
                    countries.push(id.name);
                }
                if (currentDay >= from && currentDay <= to) {
                    generateAndInsertEntryByCountry(data, currentDay, selectedCountriesDataByName);
                }
            }
            else if (currentDay >= from && currentDay <= to) {
                generateAndInsertEntry(data, element, currentDay, vaccinations, cases, deaths);
            }
        });

        if (element._id === "SC" && dailyDataList.length !== 0) {
            insertRadarEntry(element, radarData);
        }

        if (element._id === CONST.EUROPE.ID) {
            europeData.cases = cases;
            europeData.vaccinations = vaccinations;
            europeData.deaths = deaths;

            europeData.cases.sort(function (a, b) { return a.date - b.date; });
            europeData.vaccinations.sort(function (a, b) { return a.date - b.date; });
            europeData.deaths.sort(function (a, b) { return a.date - b.date; });
        }
        else if (element._id === CONST.SELECTED_COUNTRIES.ID) {
            selectedCountriesData.vaccinations = vaccinations;
            selectedCountriesData.cases = cases;
            selectedCountriesData.cases.sort(function (a, b) { return a.date - b.date; });
            selectedCountriesData.vaccinations.sort(function (a, b) { return a.date - b.date; });

            selectedCountriesData.radarData = radarData;
        }
        else {
            selectedCountriesDataByName.map((country) => {
                country.cases.sort(function (a, b) { return a.date - b.date; });
                country.vaccinations.sort(function (a, b) { return a.date - b.date; });
            })
        }

    });

    return { europeData, selectedCountriesData, selectedCountriesDataByName };
}

function insertRadarEntry(country, radarData) {
    //console.log(radarData)
    let radarDataEntry = {
        name: country.dailyData[0].name,
        life_expectancy: country.dailyData[0].life_expectancy,
        population_density: country.dailyData[0].population_density,
        gdp_per_capita: country.dailyData[0].gdp_per_capita,
        //extreme_poverty: country.dailyData[0].extreme_poverty.length < country.dailyData[0].name.length ? country.dailyData[0].extreme_poverty : 0,
        human_development_index: country.dailyData[0].human_development_index,
        cardiovasc_death_rate: country.dailyData[0].cardiovasc_death_rate,
        diabetes_prevalence: country.dailyData[0].diabetes_prevalence,
        male_smokers: country.dailyData[0].male_smokers,
        female_smokers: country.dailyData[0].female_smokers,
        median_age: country.dailyData[0].median_age
    };

    radarData.push(radarDataEntry);
}

function generateAndInsertEntry(day, country, currentDay, vaccinations, cases, deaths) {
    let value = valueAssembler(day);
    let vaccinationEntry = {
        label: country._id,
        value: value.vaccinations,
        tooltipContent: `<b>${visualizeDate(currentDay)}<br/></b><b>${country._id}</b>: ${prettyCounterHandler(value.vaccinations, CONST.COUNTER_HANDLER.LONG)}`,
        date: currentDay,
    };

    let casesEntry = {
        label: country._id,
        value: value.cases,
        tooltipContent: `<b>${visualizeDate(currentDay)}<br/></b><b>${country._id}</b>: </b>${prettyCounterHandler(value.cases, CONST.COUNTER_HANDLER.LONG)}`,
        date: currentDay,
    }

    let deathEntry = {
        label: country._id,
        value: value.deaths,
        tooltipContent: `<b>${prettyCounterHandler(value.deaths, CONST.COUNTER_HANDLER.LONG)}<b/>`,
        date: currentDay,
    };

    deaths.push(deathEntry);
    vaccinations.push(vaccinationEntry);
    cases.push(casesEntry);
}

function generateAndInsertEntryByCountry(data, currentDay, selectedCountriesData) {
    let id = data._id;
    let value = valueAssembler(data);

    let vaccinatioEntry = {
        label: id.name,
        value: value.vaccinations,
        tooltipContent: `<br/><b>${id.name}</b>: </b>${prettyCounterHandler(value.vaccinations, CONST.COUNTER_HANDLER.LONG)}`,
        date: currentDay,
    };

    let casesEntry = {
        label: id.name,
        value: value.cases,
        tooltipContent: `<br/><b>${id.name}</b>: </b>${prettyCounterHandler(value.cases, CONST.COUNTER_HANDLER.LONG)}`,
        date: currentDay,
    }

    selectedCountriesData.map((item) => {
        if (item.id == id.name) {
            item.vaccinations.push(vaccinatioEntry);
            item.cases.push(casesEntry);
        }
    })

}

function valueAssembler(day) {
    return { cases: newCasesInDate(day), vaccinations: newVaccinationsInDate(day), deaths: newDeathsInDate(day) }
}

function newCasesInDate(day) {
    return day.new_cases ? day.new_cases : day.new_cases_smoothed ? day.new_cases_smoothed : 0;
}

function newVaccinationsInDate(day) {
    return day.new_vaccinations_smoothed ? day.new_vaccinations_smoothed : 0;
}

function newDeathsInDate(day) {
    return day.new_deaths ? day.new_deaths : day.new_deaths_smoothed ? day.new_deaths_smoothed : 0;
}

//Data for test
export const mock_data2_vacs = [
    [
        { axis: "Population density / 10", value: 0 },
        { axis: "Life Expect", value: 0 },
        { axis: "GDP per Capita / 1000", value: 0 },
        //{axis:"Extreme Poverty",value:0},
        { axis: "Median age", value: 0 },
        { axis: "HDI", value: 0 }
    ]
];

export const mock_data2_cases = [
    [
        { axis: "Population density / 10", value: 0 },
        { axis: "Smokers", value: 0 },
        { axis: "Cardiovasc death rate", value: 0 },
        { axis: "Diabetes prevalence", value: 0 },
        { axis: "Median age", value: 0 }
    ]
];

export const mock_data3 = [
    [
        { axis: "Email", value: 0.59 },
        { axis: "Social Networks", value: 0.56 },
        { axis: "Internet Banking", value: 0.42 },
        { axis: "News Sportsites", value: 0.34 },
        { axis: "Search Engine", value: 0.48 }
    ], [
        { axis: "Email", value: 0.48 },
        { axis: "Social Networks", value: 0.41 },
        { axis: "Internet Banking", value: 0.27 },
        { axis: "News Sportsites", value: 0.28 },
        { axis: "Search Engine", value: 0.46 }
    ]
];

export const bar_mock_data1 = [
    { group: "banana", people_fully_vaccinated: 12, people_vaccinated: 1 },
    { group: "poacee", people_fully_vaccinated: 6, people_vaccinated: 6 },
    { group: "sorgho", people_fully_vaccinated: 11, people_vaccinated: 28 },
    { group: "triticum", people_fully_vaccinated: 19, people_vaccinated: 6 },
    { group: "1", people_fully_vaccinated: 11, people_vaccinated: 28 },
    { group: "2", people_fully_vaccinated: 19, people_vaccinated: 6 },
    { group: "3", people_fully_vaccinated: 11, people_vaccinated: 28 },
    { group: "4", people_fully_vaccinated: 19, people_vaccinated: 6 }
];

export const bar_mock_data2 = [
    { group: "", people_fully_vaccinated: 0, people_vaccinated: 0 },
];

export const mock_pca_data = [
    { country: "", pca: [[0, 0]] }
];

export const dbLabelStatic = [
    "population",
    "total_cases",
    "population_density",
    "median_age",
    "gdp_per_capita",
    "extreme_poverty",
    "cardiovasc_death_rate",
    "diabetes_prevalence",
    "female_smokers",
    "male_smokers",
    "life_expectancy",
    "human_development_index"
]

export const dbLabelDaily = [
    "new_cases",
    "new_cases_smoothed",
    "total_deaths",
    "new_deaths",
    "new_deaths_smoothed",
    "new_deaths_per_million",
    "reproduction_rate",
    "positive_rate",
    "tests_per_case",
    "stringency_index",
    "new_vaccinations_smoothed",
    "people_fully_vaccinated",
    "people_vaccinated"
]

export const countriesNames = [
    "Netherlands",
    "North Macedonia",
    "Switzerland",
    "Latvia",
    "Slovenia",
    "Bulgaria",
    "Cyprus",
    "Croatia",
    "Czechia",
    "Isle of Man",
    "Jersey",
    "Monaco",
    "France",
    "Austria",
    "Estonia",
    "Slovakia",
    "Sweden",
    "Lithuania",
    "San Marino",
    "Denmark",
    "Belgium",
    "Russia",
    "Serbia",
    "Hungary",
    "Greece",
    "Guernsey",
    "Bosnia and Herzegovina",
    "Faeroe Islands",
    "Kosovo",
    "Gibraltar",
    "Finland",
    "Ireland",
    "Liechtenstein",
    "Belarus",
    "Moldova",
    "Spain",
    "Poland",
    "Iceland",
    "Romania",
    "Italy",
    "Andorra",
    "Malta",
    "Germany",
    "Albania",
    "Montenegro",
    "Norway",
    "Luxembourg",
    "Portugal",
    "Ukraine",
    "Vatican",
    "United Kingdom"
]

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}