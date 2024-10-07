"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
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

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (movement, i) {
    const movementType = movement > 0 ? "deposit" : "withdrawal";
    const movementRow = `
  <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${i} ${movementType.toUpperCase()}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${movement}€</div>
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
  labelBalance.textContent = account.balance + "€";
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
  labelSumIn.textContent = calcSumIn(account.movements) + "€";
  labelSumOut.textContent = Math.abs(calcSumOut(account.movements)) + "€";
  labelSumInterest.textContent = calcInterest(account) + "€";
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
  displayMovements(account.movements);
};

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();

  const userName = inputLoginUsername.value;
  const userPin = Number(inputLoginPin.value);
  const account = accounts.find(
    (account) => account.userName === userName && account.pin === userPin
  );

  console.log(account);

  if (account) {
    labelWelcome.textContent = "Welcome back " + account.owner.split(" ")[0];
    inputLoginPin.value = inputLoginUsername.value = "";
    containerApp.style.opacity = 100;
    updateUI(account);
    currentAccount = account;
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
