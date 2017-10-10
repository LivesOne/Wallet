// @flow

/**
* Calculate the time difference between the two time strings
* result is an Object:
* {years, months, days, hours, minutes, seconds}
*/
export function getDateTimeDiff(startTime: string, endTime: string): Object {
    startTime = startTime.replace(/\-/g, '/');
    endTime = endTime.replace(/\-/g, '/');

    let sTime = new Date(startTime);
    let eTime = new Date(endTime);

    return getDateDiff(sTime, eTime);
}

/**
* Calculate the time past from the time string
* result is an Object:
* {years, months, days, hours, minutes, seconds}
*/
export function getTimePastFromNow(time: string): Object {
    const startTime = time.replace(/\-/g, '/');

    const sTime = new Date(startTime);
    const eTime = new Date();

    return getDateDiff(sTime, eTime);
}

/**
* Calculate the time difference between the two Date Time
* result is an Object:
* {years, months, days, hours, minutes, seconds}
*/
function getDateDiff(startTime: Date, endTime: Date): Object {
    const sTime = startTime.valueOf();
    const eTime = endTime.valueOf();

    let d = eTime - sTime;
    d = new Date(d);

    const result = {
        years: d.getFullYear() - 1970,
        months: d.getMonth(),
        days: d.getDate() - 1,
        hours: d.getHours() - 8,
        minutes: d.getMinutes(),
        seconds: d.getSeconds(),
    };

    return result;
}
