import { CONST } from "./const";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function DateHandler(from, to) {
    let shortMonthName = months.map((item) => { return item.substr(0, 3) })

    return `${addZeros(from)} ${shortMonthName[from.getMonth()]} ${from.getFullYear()} - ${addZeros(to)} ${shortMonthName[to.getMonth()]} ${to.getFullYear()}  `
    /* return from == to
     ? `${from.getDay()} ${shortMonthName[from.getMonth()]} ${to.getFullYear()} - ${to.getDay()} ${shortMonthName[to.getMonth()]} ${to.getFullYear()}`
     : `${from.getDay()} ${shortMonthName[from.getMonth()]} ${to.getFullYear()}` */
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


function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

/* export function regenerateData(from, to) {

    let value, chartData = [];
    let numDays = differenceBetweenDays(from, to);

    for (let i = 0; i < numDays+1; i++) {
        value = getRandomInt(0, 100)
        chartData.push({
            label: i,
            value,
            tooltipContent: `<b>x: </b>${i}<br><b>y: </b>${value}`,
            date: addDays(from, i),
        });

    }

    return chartData;
} */

export function refreshData(from, to, data, type) {
    let value, chartData = [];
    data.forEach(country => {
        let dailyDataList = country.dailyData;
        dailyDataList.forEach(day => {
            let currentDay = new Date(day.date);

            if(currentDay >= from && currentDay <= to) {
                
                value = handleValueType(type, day)
                console.log(value);
                chartData.push({
                    label: country._id,
                    value: value,
                    tooltipContent: `<b>x: </b>${country._id}<br><b>y: </b>${value}`,
                    date: currentDay,
                });
            }
        });

    });
    chartData.sort(function (a, b) { return a.date - b.date; });
    return chartData;
}

function handleValueType(type, day) {
    switch (type) {
        case CONST.CHART_TYPE.CASES:
            return newCasesInDate(day)
        case CONST.CHART_TYPE.VACCINATIONS:
            return newVaccinationsInDate(day)
        default:
            break;
    }
}

function newVaccinationsInDate(day) {
    return day.new_vaccinations_smoothed ? day.new_vaccinations_smoothed : 0;
}

function newCasesInDate(day) {
    return day.new_cases ? day.new_cases : day.new_cases_smoothed ? day.new_cases_smoothed : 0;
}

export const mock_data = [
    { year: 1980, efficiency: 24.3, sales: 8949000 },
    { year: 1985, efficiency: 27.6, sales: 10979000 },
    { year: 1990, efficiency: 28, sales: 9303000 },
    { year: 1991, efficiency: 28.4, sales: 8185000 },
    { year: 1992, efficiency: 27.9, sales: 8213000 },
    { year: 1993, efficiency: 28.4, sales: 8518000 },
    { year: 1994, efficiency: 28.3, sales: 8991000 },
    { year: 1995, efficiency: 28.6, sales: 8620000 },
    { year: 1996, efficiency: 28.5, sales: 8479000 },
    { year: 1997, efficiency: 28.7, sales: 8217000 },
    { year: 1998, efficiency: 28.8, sales: 8085000 },
    { year: 1999, efficiency: 28.3, sales: 8638000 },
    { year: 2000, efficiency: 28.5, sales: 8778000 },
    { year: 2001, efficiency: 28.8, sales: 8352000 },
    { year: 2002, efficiency: 29, sales: 8042000 },
    { year: 2003, efficiency: 29.5, sales: 7556000 },
    { year: 2004, efficiency: 29.5, sales: 7483000 },
    { year: 2005, efficiency: 30.3, sales: 7660000 },
    { year: 2006, efficiency: 30.1, sales: 7762000 },
    { year: 2007, efficiency: 31.2, sales: 7562000 },
    { year: 2008, efficiency: 31.5, sales: 6769000 },
    { year: 2009, efficiency: 32.9, sales: 5402000 },
    { year: 2010, efficiency: 33.9, sales: 5636000 },
    { year: 2011, efficiency: 33.1, sales: 6093000 },
    { year: 2012, efficiency: 35.3, sales: 7245000 },
    { year: 2013, efficiency: 36.4, sales: 7586000 },
    { year: 2014, efficiency: 36.5, sales: 7708000 },
    { year: 2015, efficiency: 37.2, sales: 7517000 },
    { year: 2016, efficiency: 37.7, sales: 6873000 },
    { year: 2017, efficiency: 39.4, sales: 6081000 },
]

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
