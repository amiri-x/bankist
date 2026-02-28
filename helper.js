
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
  }
  if (!/^-?\d+(\.\d{1,2})?$/.test(moneyStr)) {
    throw new Error("Invalid money format. format e.g. ##.##, ##.#, ##");
  }
  const isNegative = moneyStr.startsWith("-");
  const normalized = isNegative ? moneyStr.slice(1) : moneyStr;

  const [major, minor = "00"] = normalized.split(`${decimalSeprator}`);
  const value = Number(major) * 100 + Number(minor.padEnd(2, "0")); ''
  return isNegative ? -value : value;
}


// console.log([1, 2, 3, null].includes(null)); // true
// console.log([-2, -1, 0, 1, 2, 3, null].some(el => el <= 0)); // true
// console.log([-2, -1, 0, 1, 2, 3, null].every(el => typeof el === "number")); // false
