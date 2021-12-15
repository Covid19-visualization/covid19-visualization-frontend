/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
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
    let europeData = {}, selectedCountriesDataByName = [];

    data.forEach(element => {
        let dailyDataList = element.dailyData;
        var vaccinations = [], cases = [], deaths = [], countries = [];

        dailyDataList.forEach(data => {
            let currentDay = new Date(data._id);
            let id = data._id;

            if (element._id === CONST.SELECTED_COUNTRIES_BY_NAME.ID) {
                currentDay = new Date(id.date);
                
                if (!countries.includes(id.name)) {
                    let radarData = insertRadarEntry(data);
                    selectedCountriesDataByName.push({ id: id.name, cases: [], vaccinations: [], radarData: radarData })
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

        if (element._id === CONST.EUROPE.ID) {
            europeData.cases = cases;
            europeData.vaccinations = vaccinations;
            europeData.deaths = deaths;

            europeData.radarData = insertEuropeRadarEntry(element.dailyData[0]);
            europeData.barData = insertEuropeBarEntry(element.dailyData)

            europeData.cases.sort(function (a, b) { return a.date - b.date; });
            europeData.vaccinations.sort(function (a, b) { return a.date - b.date; });
            europeData.deaths.sort(function (a, b) { return a.date - b.date; });
        }
        else {
            selectedCountriesDataByName.map((country) => {
                country.cases.sort(function (a, b) { return a.date - b.date; });
                country.vaccinations.sort(function (a, b) { return a.date - b.date; });
            })
        }

    });

    return { europeData, selectedCountriesDataByName };
}

function insertEuropeRadarEntry(country) {
    let radarDataEntry = {
        life_expectancy: country.life_expectancy / 39,
        population_density: country.population_density / 39,
        gdp_per_capita: country.gdp_per_capita / 39,
        human_development_index: country.human_development_index / 39,
        cardiovasc_death_rate: country.cardiovasc_death_rate / 39,
        diabetes_prevalence: country.diabetes_prevalence / 39,
        male_smokers: country.male_smokers / 39,
        female_smokers: country.female_smokers / 39,
        median_age: country.median_age / 39,
        population: country.population
    };

    return radarDataEntry;
}

function sortByItem(country, item){
    let sortedResult = country.sort( (a,b) => {
        return a[item] - b[item];
      })
    let last = sortedResult[sortedResult.length - 1];
    return last
}

function insertEuropeBarEntry(country) {

    let last_vacc = sortByItem(country, "people_vaccinated")
    let last_fully = sortByItem(country, "people_fully_vaccinated")
    let last_total_d = sortByItem(country, "total_deaths")
    let last_total_b = sortByItem(country, "total_boosters")
    let last_total_s = sortByItem(country, "stringency_index")
    
    let reducer = (accumulator, curr) => accumulator + curr;
    let total_cases = last_total_d.total_cases.map(x => parseInt(x))

    let barDataEntry = {
        name: "Europe",
        population: last_vacc.population,
        people_fully_vaccinated: last_fully.people_fully_vaccinated,
        people_vaccinated: last_vacc.people_vaccinated,
        total_deaths: last_total_d.total_deaths,
        total_cases: total_cases.reduce(reducer),
        total_boosters: last_total_b.total_boosters,
        stringency_index: last_total_s.stringency_index / 39
    };
    return barDataEntry;
}

function insertRadarEntry(country) {
    let radarDataEntry = {
        life_expectancy: country.life_expectancy,
        population_density: country.population_density,
        gdp_per_capita: country.gdp_per_capita,
        human_development_index: country.human_development_index,
        cardiovasc_death_rate: country.cardiovasc_death_rate,
        diabetes_prevalence: country.diabetes_prevalence,
        male_smokers: country.male_smokers,
        female_smokers: country.female_smokers,
        median_age: country.median_age,
        population: country.population
    };

    return radarDataEntry;
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

export const mock_pca_data = [
    { country: "", pca: [[0, 0]] }
];

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export var countries_colors = {
    "Europe": "#003399"
};

export function computeDim(w, h, innerWidth, innerHeight){
    var ww = (w * innerWidth) / 1440;
    var hh = (h * innerHeight) / 821;
    return [ww, hh];
}

export const countriesNames = [
    "Netherlands",
    "Switzerland",
    "Latvia",
    "Slovenia",
    "Bulgaria",
    "Cyprus",
    "Croatia",
    "Czechia",
    "France",
    "Austria",
    "Estonia",
    "Slovakia",
    "Sweden",
    "Lithuania",
    "Denmark",
    "Belgium",
    "Russia",
    "Serbia",
    "Hungary",
    "Greece",
    "Bosnia and Herzegovina",
    "Finland",
    "Ireland",
    "Belarus",
    "Moldova",
    "Spain",
    "Poland",
    "Iceland",
    "Romania",
    "Italy",
    "Malta",
    "Germany",
    "Albania",
    "Montenegro",
    "Norway",
    "Luxembourg",
    "Portugal",
    "Ukraine",
    "United Kingdom"
]
