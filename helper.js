
/**
 * 
 * @param {string} username the username of the account
 * @param {string} pin the pin of the account
 * @param {Array} accounts the account Array
 * @returns the account that has this credentials `undefined` if not found.
 */
export function findAcc(username, pin, accounts) {
    return accounts.find(
        (acc) => username === acc.username
            && pin === acc.pin);
}




/**
 * * just to make numbers have floating points: 20 => 20.00
 * @param {*} money moeny to be changed to cents 
 * @param {*} decimalSeprator the decimal seprator for $$ (dollar) is "."
 * @returns the money in cents
 */
export function moneyToCents(money, decimalSeprator = ".") {
    let moneyStr;
    if (typeof money !== "string") {
        moneyStr = `${money}`;
    } else {
        moneyStr = money;
    }

    const euroRegex = /^-?\d+(\,\d{1,2})?$/;
    const usdRegex = /^-?\d+(\.\d{1,2})?$/;

    let regex;
    if (decimalSeprator === ".") {
        regex = usdRegex;
    } else if (decimalSeprator === ",") {
        regex = euroRegex;
    } else {
        throw new Error(`Invalid decimal seprator: '${decimalSeprator}', use '.' for $ and ',' for €`)
    }


    if (!regex.test(moneyStr)) {
        throw new Error("Invalid money format. format e.g. ##.##, ##.#, ##");
    }
    const isNegative = moneyStr.startsWith("-");
    const normalized = isNegative ? moneyStr.slice(1) : moneyStr;

    const [major, minor = "00"] = normalized.split(`${decimalSeprator}`);
    const value = Number(major) * 100 + Number(minor.padEnd(2, "0"));
    return isNegative ? -value : value;
}

/**
 * 
 * @param {Number} num The number to be fomatted
 * @param {string} locale The locale to format accoringly 
 * @param {Intl.NumberFormatOptions} options options to apply 
 * @returns a formatted number in string
 * #### e.g 
 * ```js
 * formatNum(1000.99, "en-US", {style: "currency", currency: "USD"}) // $1,000.99
 * ```
 */
export function formatNum(num, locale, options) {
    return Intl.NumberFormat(locale, options).format(num);
}

/**
 * 
 * @param {Date} dateObj Date object to extract date and time from
 * @returns return an string containing date and time in the following 
 * format: `dd/MM/YYYY, HH:mm`
 */
export function getDateAndTime(dateObj) {
    const year = dateObj.getFullYear();
    const month = `${dateObj.getMonth() + 1}`.padStart(2, 0);
    const day = `${dateObj.getDate()}`.padStart(2, 0);

    const hours = `${dateObj.getHours()}`.padStart(2, 0);
    const minutes = `${dateObj.getMinutes()}`.padStart(2, 0);
    return `${day}/${month}/${year}, ${hours}:${minutes}`
}

/**
 * 
 * @param {Date} dateObj Date object to extract date from
 * @returns return an string containing date in the following 
 * format: `dd/MM/YYYY`
 */
export function getDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = `${dateObj.getMonth() + 1}`.padStart(2, 0);
    const day = `${dateObj.getDate()}`.padStart(2, 0);

    return `${day}/${month}/${year}`
}

/**
 * Just calculates the days passed between two dates
 * 
 * @param {Date} oldDate the first date obj
 * @param {Date} newDate the second date obj
 * @returns 
 * 1. if 0 day passed => TODAY
 * 2. if 1 day passed => YESTERDAY
 * 3. if 2-7(exclusive) days passed => # days ago
 * 4. if 7 days passed => A WEEK AGO
 * 4. if days passed > 7 => the __oldDate__ in the following format: `dd/MM/YYYY`
 */
export function getDaysPassed(oldDate, newDate) {

    const dateDiff = Math.abs(oldDate.getTime() - newDate.getTime());
    const daysPassed = Math.round(dateDiff / (1000 * 60 * 60 * 24));

    const date = getDate(new Date(oldDate));


    switch (daysPassed) {
        case 0: return "TODAY"
        case 1: return "YESTERDAY"
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return `${daysPassed} DAYS AGO`
        case 7:
            return `A WEEK AGO`
        default:
            return date;
    }
}