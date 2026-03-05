import { findAcc, getDateAndTime, getDate, getDaysPassed, formatNum } from "./helper.js"



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data


const account1 = {
    owner: 'Abufazl Amiri',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.6, // %
    pin: '1011',

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2026-02-25T16:33:06.386Z',
        '2026-03-02T14:43:26.374Z',
        '2026-03-03T18:49:59.371Z',
        '2026-03-04T12:01:20.894Z',
        '2026-03-04T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account2 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 5000, -642.21, -133.9, 79.87, 234],
    interestRate: 1.2, // %
    pin: "1111",

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2026-02-25T16:33:06.386Z',
        '2026-03-02T14:43:26.374Z',
        '2026-03-03T18:49:59.371Z',
        '2026-03-04T12:01:20.894Z',
        '2026-03-04T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'fr-FR', // de-DE
};

const account3 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: "2222",

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-02-25T16:33:06.386Z',
        '2020-03-02T14:43:26.374Z',
        '2026-03-03T18:49:59.371Z',
        '2026-03-04T12:01:20.894Z',
        '2026-03-04T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account4 = {
    owner: 'Ali Mohammadi',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: "3333",

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-25T16:33:06.386Z',
        '2020-03-02T14:43:26.374Z',
        '2026-03-03T18:49:59.371Z',
        '2026-03-04T12:01:20.894Z',
    ],
    currency: 'AFN',
    locale: 'fa-AF', // or ps-AF - for pashto Afghanistan
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

// me 
const messageTransferEl = document.querySelector(".message--transfer")

// handles whole app interface data representations 
let currentAccount;
let currectTimer;




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





/**
 * 
 * @param {any} acc the acc containing array movements and  data to be sorted
 * @param {String[]} movementsDates the movementDates in ISO format
 * @param {*} sortType wether to sort it `0=Ascending` || `1=descending` || `-1=insertion order (default)`
 */
const displayMovementsAndDates = function (acc, movementsDates, sortType = -1) {
    containerMovements.innerHTML = '';

    // * sorting
    let movs;
    // do not change
    if (sortType === -1) {
        movs = acc.movements;
    }
    // ascedning 
    else if (sortType === 0) {
        movs = acc.movements.slice().sort((a, b) => {
            // if ((a - b) < 0) return -1; // * keep it -> a, b
            // if ((a - b) > 0) return 1;  // * switch -> b, a
            // if ((a - b) === 0) return 0;// * keep it > a, b

            // in one shot 
            return a - b;
        });
    }
    // descending 
    else if (sortType === 1) {
        movs = acc.movements.slice().sort((a, b) => b - a);
    }


    // * movements and movementsDates must have same length
    movs.forEach(function (mov, i) {
        const movType = mov > 0 ? "deposit" : "withdrawal";
        // converting iso dates to dd/MM/YYYY
        const date = getDaysPassed(new Date(movementsDates[i]), new Date());
        // formatting the monies to locales accordingly 
        const money = formatNum(mov, acc.locale, { style: "currency", currency: acc.currency });
        const movEl =
            `
            <div class="movements__row">
                <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
                <div class="movements__date">${date}</div>
                <div class="movements__value">${money}</div>
            </div>
            `;
        containerMovements.insertAdjacentHTML("afterbegin", movEl);

    });

}

/**
 * 
 * @param {Number []} movements the array data 
 * @param {string} locale the locale 
 * @param {string} currency the currency
 * @returns calculated final __balance__ from all movements 
 */
const calcAndDisplayBalance = function (
    movements,
    locale = "en-US",
    currency = "USD"
) {
    const balance = movements.reduce((acc, current) => acc + current, 0);
    labelBalance.textContent = formatNum(balance, locale, { style: "currency", currency })
    return Number(balance.toFixed(2));
}

// in
const calcAndDisplayTotalIn = function (
    movements,
    locale = "en-US",
    currency = "USD"
) {
    const totalIn =
        movements.filter(mov => mov > 0) // finding deposits
            .reduce((acc, current) => acc + current, 0);
    labelSumIn.textContent = formatNum(totalIn, locale, { style: "currency", currency });
}
// out
const calcAndDisplayTotalOut = function (
    movements,
    locale = "en-US",
    currency = "USD"
) {
    const totalOut = movements.filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = formatNum(Math.abs(totalOut), locale, { style: "currency", currency });
}
// interest
const calcAndDisplayTotalInterest = function (
    movements,
    interestRate,
    locale = "en-US",
    currency = "USD"
) {

    const totalInterest = movements.filter(mov => mov > 0)
        .map(mov => mov * (interestRate / 100))
        .filter((int) => int >= 1) // only interests above 1
        .reduce((acc, current) => acc + current);
    labelSumInterest.textContent = formatNum(totalInterest, locale, { style: "currency", currency })
}

const updateUI = function (account) {
    displayMovementsAndDates(account, account.movementsDates);

    const balance = calcAndDisplayBalance(
        account.movements,
        account.locale,
        account.currency
    );

    // adding balance property to the account obj
    account.balance = balance;

    // does not return data
    calcAndDisplayTotalIn(
        account.movements,
        account.locale,
        account.currency
    );
    calcAndDisplayTotalOut(
        account.movements,
        account.locale,
        account.currency
    );
    calcAndDisplayTotalInterest(
        account.movements,
        account.interestRate,
        account.locale,
        account.currency
    );

    // show dates and times 
    labelDate.textContent = getDateAndTime(new Date());
}


const showAppUIAndResetLoginForm = function () {
    containerApp.style.opacity = "1";
    inputTransferTo.focus();
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
}
const hideAppUIAndResetLoginForm = function () {
    containerApp.style.opacity = "0";
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



// timer
const startLogOutTimer = function () {
    // time (sec)
    let time = 125;


    const tick = function () {
        const min = Math.trunc(time / 60);
        const sec = time % 60;

        // display
        labelTimer.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`

        // if time is up -> logout
        if (time <= 0) {
            hideAppUIAndResetLoginForm();
            // stop the timer
            if (currectTimer) clearInterval(currectTimer);
            time = 125;
        }

        // decrease time
        time--;
    }

    // immediately calling it, to solve the first 1s issue
    tick();

    return setInterval(tick, 1000);
}

// login
btnLogin.addEventListener("click", (e) => {
    // to prevent submiting (submitting reload the page)
    e.preventDefault();

    // handling focus and empty fields
    if (!inputLoginUsername.value || !inputLoginPin.value) {
        if (!inputLoginUsername.value) {
            inputLoginUsername.focus();
            return;
        } else {
            inputLoginPin.focus();
            return;
        }
    }

    const loginingUsername = inputLoginUsername.value;
    const loginingPin = inputLoginPin.value;


    // validate credentials
    currentAccount = findAcc(loginingUsername, loginingPin, accounts);

    if (!currentAccount) {
        showLoginFailure();
        return;
    }

    console.log("logining...");

    // start log out timer
    if (currectTimer) clearInterval(currectTimer);
    currectTimer = startLogOutTimer();

    // display ui
    showAppUIAndResetLoginForm();
    // display welcome message with first name
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    updateUI(currentAccount);

    console.log(currentAccount);
});

// initial message
let initialMsg = messageTransferEl.textContent;
let defaultColor = messageTransferEl.style.color;
// show transfter failure message for 5 sec
const showTransferMessage = function (type = "INFORMATION", code) {
    const inSuffecientFundsMsg = "Insufficient funds"
    const usernameNotFoundMsg = "Username not found"
    const negativeAmountMsg = "Amount can't be negative, minimum amount: $1"
    const sameAccountMsg = "Can't transfer money to your own account";
    const successMsg = "Amount sent!"
    if (type === "INFORMATION") {
        messageTransferEl.textContent = initialMsg
    } else if (type === "ERROR") {
        // not found
        if (code === 404) {
            messageTransferEl.textContent = usernameNotFoundMsg;
            messageTransferEl.style.color = "#BB1111";
            setTimeout(function () {
                messageTransferEl.textContent = initialMsg;
                messageTransferEl.style.color = defaultColor;
            }, 5000);

            // insuffecient balance
        } else if (code === 402) {
            messageTransferEl.textContent = inSuffecientFundsMsg;
            messageTransferEl.style.color = "#BB1111";
            setTimeout(function () {
                messageTransferEl.textContent = initialMsg;
                messageTransferEl.style.color = defaultColor;
            }, 5000);

            // bad request: negative amount
        } else if (code === 400) {
            messageTransferEl.textContent = negativeAmountMsg;
            messageTransferEl.style.color = "#BB1111";
            setTimeout(function () {
                messageTransferEl.textContent = initialMsg;
                messageTransferEl.style.color = defaultColor;
            }, 5000);

            // same account
        } else if (code === 422) {
            messageTransferEl.textContent = sameAccountMsg;
            messageTransferEl.style.color = "#BB1111";
            setTimeout(function () {
                messageTransferEl.textContent = initialMsg;
                messageTransferEl.style.color = defaultColor;
            }, 5000);
        }

    } else if (type === "SUCCESS" && code === 200) {
        messageTransferEl.textContent = successMsg;
        messageTransferEl.style.color = "#11BB11";
        setTimeout(function () {
            messageTransferEl.textContent = initialMsg;
            messageTransferEl.style.color = defaultColor;
        }, 5000);

    }
}

// transfering 
btnTransfer.addEventListener("click", function (e) {
    // prevent to reload page 
    e.preventDefault();
    // check if inputs are filled

    // handling focus and empty fields
    if (!inputTransferTo.value || !inputTransferAmount.value) {
        if (!inputTransferTo.value) {
            inputTransferTo.focus();
            return;
        } else {
            inputTransferAmount.focus();
            return;
        }
    }


    const usernameTo = inputTransferTo.value;
    const amountTransfer = inputTransferAmount.value;

    const reciever = accounts.find((acc) => {
        return usernameTo === acc.username;
    });
    const amount = Number(amountTransfer);



    // validate amount 
    // minimum amount 1
    if (amount < 1) {
        showTransferMessage("ERROR", 400);
        return;
    }
    if (!reciever) {
        showTransferMessage("ERROR", 404);
        inputTransferTo.focus();
        return;
    }
    if (reciever.username === currentAccount.username) {
        showTransferMessage("ERROR", 422);
        return;
    }
    if (amount > currentAccount.balance) {
        showTransferMessage("ERROR", 402);
        return;
    }


    // subtracting from current account
    currentAccount.movements.push(-amount);
    // add date
    currentAccount.movementsDates.push(new Date());


    // add amount to reciever 
    reciever.movements.push(amount);
    // add date
    reciever.movementsDates.push(new Date());


    // reset the current timer to track activity 
    if (currectTimer) clearInterval(currectTimer);
    currectTimer = startLogOutTimer();

    ////// update ui

    // show success message
    showTransferMessage("SUCCESS", 200);
    // emtpying fields
    inputTransferTo.value = "";
    inputTransferAmount.value = "";
    inputTransferTo.focus();

    //// update values
    updateUI(currentAccount);





    console.log(`${amount} to ${reciever.username}`);
    console.log(currentAccount);
    console.log(reciever);
});



// requesting a loan
btnLoan.addEventListener("click", function (e) {
    // to prevent from reloading
    e.preventDefault();

    // handling focus and empty fields
    if (!inputLoanAmount.value) {
        inputLoanAmount.focus();
        return;
    }
    const amountLoan = Number(inputLoanAmount.value);

    // *  rule: user only can get loan if ever has deposited at least 10% of the loan 
    // *  minimum amount is 1

    // validate amount
    if (amountLoan < 1
        || !currentAccount.movements.some((mov) => mov >= amountLoan * (10 / 100))
    ) {
        // TODO: show failure message
        return;
    }


    ////// adding a deposit

    // empty field to not freeze ui 
    inputLoanAmount.value = "";
    // disable field and button
    inputLoanAmount.disabled = true;
    btnLoan.disabled = true;
    // TODO: show success message 

    // reset timer to not freeze ui
    if (currectTimer) clearInterval(currectTimer);
    currectTimer = startLogOutTimer();

    // after 5sec
    setTimeout(function () {
        currentAccount.movements.push(amountLoan);
        currentAccount.movementsDates.push(new Date());
        // able field and button
        inputLoanAmount.disabled = false;
        btnLoan.disabled = false;

        // updateUI
        updateUI(currentAccount);
    }, 5000);
});

// closing an account
btnClose.addEventListener("click", function (e) {
    // to prevent from reloading the page 
    e.preventDefault();

    // handling focus and empty fields
    if (!inputCloseUsername.value || !inputClosePin.value) {
        if (!inputCloseUsername.value) {
            inputCloseUsername.focus();
            return;
        } else {
            inputClosePin.focus();
            return;
        }
    }


    const closingUsername = inputCloseUsername.value;
    const closingPin = inputClosePin.value;

    // deleting account from the list
    if (closingUsername !== currentAccount.username) return;
    // TODO: show failure message if account is others

    const closingAcc = findAcc(closingUsername, closingPin, accounts);
    if (!closingAcc) {
        // TODO: show failure message if account not found
        return;
    } else {
        accounts.splice(accounts.indexOf(closingAcc), 1);
    }

    // empty close form fields 
    inputCloseUsername.value = "";
    inputClosePin.value = "";
    // hide ui
    hideAppUIAndResetLoginForm();




    console.log(`username: ${closingUsername} pin: ${closingPin} closingAcc: ${closingAcc}`);
    console.log(accounts);
});


// sorting 
let sorted = false;
btnSort.addEventListener("click", function (e) {
    // to prevent from reload 
    e.preventDefault();
    if (!sorted) {
        displayMovementsAndDates(currentAccount, currentAccount.movementsDates, 0);
        sorted = true;
    } else {
        displayMovementsAndDates(currentAccount, currentAccount.movementsDates, 1);
        sorted = false;

    }
});






const allMovements =
    accounts.flatMap(acc => acc.movements)
        .reduce((acc, current) => {
            const cur = current < 0 ? current * (-1) : current
            return Number(acc.toFixed(2)) + cur;
        });

