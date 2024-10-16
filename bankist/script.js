"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
let currentAccount;

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

/////////////////////////////////////////////////

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (movement, i) {
    const date = new Date(account.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = day + "/" + month + "/" + year;

    const movementType = movement > 0 ? "deposit" : "withdrawal";
    const movementRow = `
  <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${i} ${movementType.toUpperCase()}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${movement.toFixed(2)}€</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML("afterbegin", movementRow);
  });
};

const calcArrSum = function (arr) {
  return arr.reduce((acc, curr) => acc + curr, 0);
};

const displayBalance = function (account) {
  account.balance = calcArrSum(account.movements);
  labelBalance.textContent = account.balance.toFixed(2) + "€";
};

const calcSumIn = function (movements) {
  return calcArrSum(movements.filter((movement) => movement > 0));
};

const calcSumOut = function (movements) {
  return calcArrSum(movements.filter((movement) => movement < 0));
};

const calcInterest = function (account) {
  return calcArrSum(
    account.movements
      .filter((movement) => movement > 0)
      .map((movement) => (movement * account.interestRate) / 100)
      .filter((interest) => interest >= 1)
  );
};

const displayAccountSummary = function (account) {
  labelSumIn.textContent = calcSumIn(account.movements).toFixed(2) + "€";
  labelSumOut.textContent =
    Math.abs(calcSumOut(account.movements)).toFixed(2) + "€";
  labelSumInterest.textContent = calcInterest(account).toFixed(2) + "€";
};

const createUserNames = function (accounts) {
  accounts.forEach(function (account) {
    account.userName = account.owner
      .toLowerCase()
      .split(" ")
      .map((str) => str[0])
      .join("");
  });
};

createUserNames(accounts);

const updateUI = function (account) {
  displayAccountSummary(account);
  displayBalance(account);
  displayMovements(account);
};

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();

  const userName = inputLoginUsername.value;
  const userPin = Number(inputLoginPin.value);
  const account = accounts.find(
    (account) => account.userName === userName && account.pin === userPin
  );

  if (account) {
    labelWelcome.textContent = "Welcome back " + account.owner.split(" ")[0];
    inputLoginPin.value = inputLoginUsername.value = "";
    containerApp.style.opacity = 100;
    updateUI(account);
    currentAccount = account;
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = now.getHours();
    const minute = now.getMinutes();
    labelDate.textContent =
      day + "/" + month + "/" + year + ", " + hour + ":" + minute;
  }
});

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const transferTo = inputTransferTo.value;
  const destinationAccount = accounts.find(
    (account) => account.userName === transferTo
  );

  if (
    destinationAccount &&
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    currentAccount.userName !== destinationAccount.userName
  ) {
    currentAccount.movements.push(transferAmount * -1);
    destinationAccount.movements.push(transferAmount);
    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = "";
});

btnClose.addEventListener("click", function (event) {
  event.preventDefault();

  const confirmUser = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);

  if (
    currentAccount.userName === confirmUser &&
    currentAccount.pin === confirmPin
  ) {
    const index = accounts.findIndex(
      (account) => account.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));

  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement > 0.1 * amount)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(Date.now());
    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
});

let sort = false;
btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  sort = !sort;
  displayMovements(currentAccount, sort);
});
