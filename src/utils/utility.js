/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import { CONST } from "./const";
import * as d3 from 'd3';

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
        ? (counter / CONST.MILION).toFixed(1) >= 1 ? (counter / CONST.MILION).toFixed(1) + " M" : (counter / CONST.THOUSAND).toFixed(1) >= 1 ? (counter / CONST.THOUSAND).toFixed(1) + " k" : (counter)
        : (counter / CONST.MILION).toFixed(1) >= 1 ? (counter / CONST.MILION).toFixed(1) + "M" : (counter / CONST.THOUSAND).toFixed(1) >= 1 ? (counter / CONST.THOUSAND).toFixed(1) + "k" : (counter)
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
                    selectedCountriesDataByName.push({ id: id.name, cases: [], vaccinations: [], deaths: [], radarData: radarData })
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
                country.deaths.sort(function (a, b) { return a.date - b.date; });

            })
        }

    });

    return { europeData, selectedCountriesDataByName };
}

function insertEuropeRadarEntry(country) {

    return {
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

    return {
        name: "Europe",
        population: last_vacc.population,
        people_fully_vaccinated: last_fully.people_fully_vaccinated,
        people_vaccinated: last_vacc.people_vaccinated,
        total_deaths: last_total_d.total_deaths,
        total_cases: total_cases.reduce(reducer),
        total_boosters: last_total_b.total_boosters,
        stringency_index: last_total_s.stringency_index / 39
    };
}

function insertRadarEntry(country) {
    return {
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

}

function generateAndInsertEntry(day, country, currentDay, vaccinations, cases, deaths) {
    let value = valueAssembler(day);
    let vaccinationEntry = {
        label: country._id,
        value: value.vaccinations,
        tooltipContent: `<b>Vaccinations</b><br/><b>${visualizeDate(currentDay)}<br/></b><b>${country._id}</b>: ${prettyCounterHandler(value.vaccinations, CONST.COUNTER_HANDLER.LONG)}`,
        date: currentDay,
    };

    let casesEntry = {
        label: country._id,
        value: value.cases,
        tooltipContent: `<b>Cases</b><br/><b>${visualizeDate(currentDay)}<br/></b><b>${country._id}</b>: </b>${prettyCounterHandler(value.cases, CONST.COUNTER_HANDLER.LONG)}`,
        date: currentDay,
    }

    let deathEntry = {
        label: country._id,
        value: value.deaths,
        tooltipContent: `<b>Deaths</b><br/><b>${visualizeDate(currentDay)}<br/></b><b>${country._id}</b>: </b>${prettyCounterHandler(value.deaths, CONST.COUNTER_HANDLER.LONG)}`,
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

    let deathsEntry = {
        label: id.name,
        value: value.deaths,
        tooltipContent: `<br/><b>${id.name}</b>: </b>${prettyCounterHandler(value.deaths, CONST.COUNTER_HANDLER.LONG)}`,
        date: currentDay,
    }

    selectedCountriesData.map((item) => {
        if (item.id == id.name) {
            item.vaccinations.push(vaccinatioEntry);
            item.cases.push(casesEntry);
            item.deaths.push(deathsEntry);
        }
    })

}

function valueAssembler(day) {
    return { cases: newCasesInDate(day), vaccinations: newVaccinationsInDate(day), deaths: newDeathsInDate(day) }
}

function newCasesInDate(day) {
    return day.new_cases? day.new_cases : 0;
}

function newVaccinationsInDate(day) {

    return day.new_vaccinations ? day.new_vaccinations : 0;
}

function newDeathsInDate(day) {
    return day.new_deaths ? Math.round(day.new_deaths) : 0;
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

export function onClick(id, cfg){
    d3.select("tr#"+id).style("background-color", cfg.colorInteraction[1]);
    //var id = node.attr("id").replace(/\s/g, "");
    var g = d3.select("#polygons");
    var p_selected = d3.select("#polygon"+id);
    var c_selected = "circle#"+id;
    var l_selected = d3.selectAll("#path"+id);
    var r_selected = d3.selectAll("#rect"+id);
    var par_selected = d3.selectAll("#line"+id)

    var pca = d3.select("#pca_container");
    var line = d3.select("#line_container")
    var bar = d3.select("#bar_container");
    var par = d3.select("#paral_container")

    g.selectAll("polygon")
        .transition(200)
        .style("fill-opacity", 0);
    bar.selectAll("rect")
        .transition(200)
        .style("fill-opacity", 0.2);
    pca.selectAll("circle")
        .transition(200)
        .style("fill-opacity", 0); 
    pca.selectAll(c_selected)
        .transition(200)
        .style("fill-opacity", 1);
    line.selectAll("path")
        .transition(200)
        .style("stroke-opacity", 0.2);
    line.selectAll("path.domain")
        .transition(200)
        .style("stroke-opacity", 1);
    par.selectAll("path")
        .transition(200)
        .style("stroke-opacity", 0.2);

    p_selected.transition(200)
        .style("fill-opacity", cfg.full_opacity);
    l_selected.transition(200)
        .style("stroke-opacity", 1);
    r_selected.transition(200)
        .style("fill-opacity", 1);
    par_selected.transition(200)
        .style("stroke-opacity", 1);
}

export function onMouseOut(id, cfg){
    d3.selectAll("tr").style("background-color", cfg.colorInteraction[0]);
    var g = d3.select("#polygons");
    var pca = d3.select("#pca_container");
    var line = d3.select("#line_container");
    var bar = d3.select("#bar_container");
    var par = d3.select("#paral_container")

    pca.selectAll("circle")
        .transition(200)
        .style("fill-opacity", 1);
    bar.selectAll("rect")
        .transition(200)
        .style("fill-opacity", 1);
    g.selectAll("polygon")
        .transition(200)
        .style("fill-opacity", cfg.standard_opacity);
    line.selectAll("path")
        .transition(200)
        .style("stroke-opacity", 1);
    par.selectAll("path")
        .transition(200)
        .style("stroke-opacity", 1);
}
