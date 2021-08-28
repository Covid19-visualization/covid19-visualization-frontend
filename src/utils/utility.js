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
    let lastPeriod = new Date(`${today.getFullYear() - year}-${today.getMonth() +1 - month}-${today.getDate() - day}`)
    return lastPeriod;
}