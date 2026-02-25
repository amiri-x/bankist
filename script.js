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

const calcAndDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, current) => acc + current, 0);
  labelBalance.textContent = `$${balance.toFixed(2)}`;
}
calcAndDisplayBalance(account1.movements);

// in
const calcAndDisplayTotalIn = function (movements) {
  const totalIn =
    movements.filter(mov => mov > 0) // finding deposits
      .reduce((acc, current) => acc + current, 0);
  labelSumIn.textContent = `$${totalIn.toFixed(2)}`;
}
// out
const calcAndDisplayTotalOut = function (movements) {
  const totalOut = movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `$${Math.abs(totalOut).toFixed(2)}`;
}
// interest
const calcAndDisplayTotalInterest = function (movements, interestRate) {

  const totalInterest = movements.filter(mov => mov > 0)
    .map(mov => mov * (interestRate / 100))
    .filter((int) => int >= 1) // only interests above 1
    .reduce((acc, current) => acc + current);
  labelSumInterest.textContent = `$${totalInterest.toFixed(2)}`;
}

let currentAccount;

const displayAndUpdateUI = function () {
  containerApp.style.opacity = "1";
  inputTransferTo.focus();
  inputLoginUsername.value = "";
  inputLoginPin.value = "";


}
const showLoginFailure = function () {
  const prevMsg = labelWelcome.textContent;
  labelWelcome.textContent = "Wrong credentials.";
  labelWelcome.style.color = "#dd1111"
  setTimeout(() => {
    labelWelcome.style.color = document.querySelector("body").style.color;
    labelWelcome.textContent = prevMsg;
  }, 5000);
}

const validateCredentials = function (username, pin) {
  return accounts.find(
    (acc) => username === acc.username
      && pin === acc.pin);
};


// login
btnLogin.addEventListener("click", (e) => {
  // to prevent submiting (submitting reload the page)
  e.preventDefault();
  // validate credentials
  currentAccount = validateCredentials(inputLoginUsername.value, inputLoginPin.value);

  if (!currentAccount) {
    showLoginFailure();
    return;
  }

  console.log("logining...");
  // display ui
  displayAndUpdateUI();
  // display welcome message with first name
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
  // display movements
  displayMovements(currentAccount.movements);
  // dispaly balance
  calcAndDisplayBalance(currentAccount.movements);
  // display sum
  calcAndDisplayTotalIn(currentAccount.movements);
  calcAndDisplayTotalOut(currentAccount.movements);
  calcAndDisplayTotalInterest(currentAccount.movements, currentAccount.interestRate);

  console.log(currentAccount);
});





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






////// TODO: delete this ones later

const max = account1.movements.reduce((acc, current, i, arr) => {
  return acc > current ? acc : current
}, account1.movements[0]);

const avr =
  account1.movements.length === 0 ?
    0
    : account1.movements.reduce((acc, current) => acc + current, 0)
    / account1.movements.length;

const jessicaAcc = accounts.find(acc => acc.owner === "Jessica Davis");
const jessicaFirstDeposit = jessicaAcc.movements.find(mov => mov > 0)
/**
 *
console.log(jessicaAcc, jessicaFirstDeposit);
console.log(max);
console.log(avr);
*/ 