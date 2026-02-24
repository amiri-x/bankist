'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Abufazl Amiri',
  movements: [200, 450, -400, 3000, -650, -130, -70.01, 1300],
  interestRate: 1.2, // %
  pin: '1011',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: '2222',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: '3333',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: '4444',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username =
      acc.owner
        .trim()
        .toLowerCase()
        .split(" ")
        .map(uname => uname[0])
        .join("");
  });
}
createUsernames(accounts);

// to format numbers as money: 10 => 10.00
const formatMonies = function (accs) {
  accs.forEach(function (acc) {
    acc.movements = acc.movements.map(mov => Number(mov.toFixed(2)));
  });
}
formatMonies(accounts);





const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const movType = mov > 0 ? "deposit" : "withdrawal";
    const movEl =
      `
        <div class="movements__row">
          <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
          <div class="movements__value">${mov}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", movEl);

  });

}
displayMovements(account1.movements);






///////// helpers




///////// chaging currencies 
const euroToUsd = 1.09;
const movementsUsds = account1.movements.map(function (mov) {
  return (mov * euroToUsd).toFixed(2);
});
// console.log("--------- movements euros --------");
// console.log(account1.movements);
// console.log("--------- movements usds  --------");
// console.log(movementsUsds);


///////// creating arr for dopsit and withdrawals
const deposits = account1.movements.filter(mov => mov > 0);
const withdrawals = account1.movements.filter(mov => mov < 0);
// console.log(deposits, withdrawals);

// * just to make numbers have floating points: 20 => 20.00

const parseMoneyToCents = function (str, decimalSeprator = ".") {
  if (typeof str !== "string") {
    throw new Error("Money must be sent as string.")
  }
  if (!/^-?\d+(\.\d{1,2})?$/.test(str)) {
    throw new Error("Invalid money format. format e.g. ##.##, ##.#, ##");
  }
  const isNegative = str.startsWith("-");
  const normalized = isNegative ? str.slice(1) : str;

  const [major, minor = "00"] = normalized.split(`${decimalSeprator}`);
  const value = Number(major) * 100 + Number(minor.padEnd(2, "0")); ''
  return isNegative ? -value : value;
}

// accounts.forEach(function (acc) {
//   acc.minors = acc.movements.map(mov => parseMoneyToCents(`${mov}`));
// });