// @flow

import LVStrings from '../assets/localization';

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
export function getTimePastFromNow(time: string): string {
    const startTime = time.replace(/\-/g, '/');

    const sTime = new Date(startTime);
    const eTime = new Date();

    const diff = getDateDiff(sTime, eTime);

    if (!diff.avaiable) {
        return time;
    } else if (diff.years > 0) {
        return time
    } else if (diff.months > 0) {
        return diff.months + ' ' + LVStrings.time_pass_months_ago;
    } else if (diff.days > 1) {
        return diff.days + ' ' + LVStrings.time_pass_days_ago;
    } else if (diff.days === 1) {
        return LVStrings.time_pass_yesterday;
    } else if (diff.hours > 0) {
        return diff.days + ' ' + LVStrings.time_pass_hours_ago;
    } else if (diff.minutes > 0) {
        return diff.days + ' ' + LVStrings.time_pass_minutes_ago
    } else {
        return LVStrings.time_pass_a_moment_ago;
    }
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
        avaiable: d >= 0,
        years: d.getFullYear() - 1970,
        months: d.getMonth(),
        days: d.getDate() - 1,
        hours: d.getHours() - 8,
        minutes: d.getMinutes(),
        seconds: d.getSeconds(),
    };

    return result;
}
