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
    let dayOfTheMonth = today.getDate() - day <= 0 ? new Date(today.getYear(), today.getMonth() -1 , 0).getDate() - (day - today.getDate()) : today.getDate() - day
    let fixedMonth = today.getDate() - day <= 0 ? today.getMonth() - month : today.getMonth() + 1 - month

    return new Date(`${today.getFullYear() - year}-${fixedMonth}-${dayOfTheMonth}`);
}

export function differenceBetweenDays(from, to) {
    
    const utc1 = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const utc2 = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  
    return Math.floor((utc2 - utc1) / CONST.MS_PER_DAY);   
}

export function parseData (from, to, data) {
    let europeData = {}, selectedCountriesData = {};
    data.forEach(country => {
        let dailyDataList = country.dailyData;
        var vaccinations = [], cases = [], radarData = [];

        dailyDataList.forEach(day => {
            let currentDay = new Date(day._id);

            if(currentDay >= from && currentDay <= to) {
                generateAndInsertEntry(day, country, currentDay, vaccinations, cases);
            }
        });

        if(country._id == "SC" && dailyDataList.length != 0)
            insertRadarEntry(country, radarData);

        if(country._id == CONST.EUROPE.ID ) {
            europeData.vaccinations = vaccinations;
            europeData.cases = cases;
            europeData.cases.sort(function (a, b) { return a.date - b.date; });
            europeData.vaccinations.sort(function (a, b) { return a.date - b.date; });
        }
        else { 
            selectedCountriesData.vaccinations = vaccinations;
            selectedCountriesData.cases = cases;
            selectedCountriesData.cases.sort(function (a, b) { return a.date - b.date; });
            selectedCountriesData.vaccinations.sort(function (a, b) { return a.date - b.date; });
            
            selectedCountriesData.radarData = radarData;
        }

    });

    return {europeData, selectedCountriesData};
}

function insertRadarEntry(country, radarData) {
    var ep = 0
    console.log(radarData)
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

function generateAndInsertEntry(day, country, currentDay, vaccinations, cases) {
    let value = valueAssembler(day);
    
    let vaccinatioEntry = {
        label: country._id,
        value: value.vaccinations,
        tooltipContent: `<b>${visualizeDate(currentDay)}\nCountry: </b>${country._id}\n<b>Vaccinations: </b>${value.vaccinations}`,
        date: currentDay,
    };
    
    let casesEntry = {
        label: country._id,
        value: value.cases,
        tooltipContent: `<b>Country: </b>${country._id}\n<b>Cases: </b>${value.cases}`,
        date: currentDay,
    }

    vaccinations.push(vaccinatioEntry);
    cases.push(casesEntry);
}

function valueAssembler(day) {
     return { cases: newCasesInDate(day), vaccinations:  newVaccinationsInDate(day)}
}

function newVaccinationsInDate(day) {
    return day.new_vaccinations_smoothed ? day.new_vaccinations_smoothed : 0;
}

function newCasesInDate(day) {
    return day.new_cases ? day.new_cases : day.new_cases_smoothed ? day.new_cases_smoothed : 0;
}
 
//Data for test
export const mock_data2_vacs = [
    [
        {axis:"Population density / 10",value:0},
        {axis:"Life Expect",value:0},
        {axis:"GDP per Capita / 1000",value:0},
        //{axis:"Extreme Poverty",value:0},
        {axis:"Median age",value:0},
        {axis:"HDI",value:0}
    ]
];

export const mock_data2_cases = [
    [
        {axis:"Population density / 10",value:0},
        {axis:"Smokers",value:0},
        {axis:"Cardiovasc death rate",value:0},
        {axis:"Diabetes prevalence",value:0},
        {axis:"Median age",value:0}
    ]
];

export const mock_data3 = [
    [
        {axis:"Email",value:0.59},
        {axis:"Social Networks",value:0.56},
        {axis:"Internet Banking",value:0.42},
        {axis:"News Sportsites",value:0.34},
        {axis:"Search Engine",value:0.48}
    ],[
        {axis:"Email",value:0.48},
        {axis:"Social Networks",value:0.41},
        {axis:"Internet Banking",value:0.27},
        {axis:"News Sportsites",value:0.28},
        {axis:"Search Engine",value:0.46}
    ]
];

export const mock_pca_data = [
    { country: "", pca: [[0, 0]] }
];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

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