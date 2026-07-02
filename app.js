import { CalculatorEngine } from "./calculator.js";

const calculator = new CalculatorEngine();
const screen = document.querySelector("#screen");
const history = document.querySelector("#history");
const keypad = document.querySelector(".keypad");

const keyboardMap = {
  "+": { type: "operator", value: "add" },
  "-": { type: "operator", value: "subtract" },
  "*": { type: "operator", value: "multiply" },
  x: { type: "operator", value: "multiply" },
  X: { type: "operator", value: "multiply" },
  "/": { type: "operator", value: "divide" },
  Enter: { type: "action", value: "equals" },
  "=": { type: "action", value: "equals" },
  ".": { type: "action", value: "decimal" },
  ",": { type: "action", value: "decimal" },
  "%": { type: "action", value: "percent" },
  Escape: { type: "action", value: "clear" },
  Backspace: { type: "action", value: "clear" }
};

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  handleButton(button);
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^\d$/.test(key)) {
    calculator.inputDigit(key);
    updateDisplay();
    flashKey(`[data-number="${key}"]`);
    return;
  }

  const mappedKey = keyboardMap[key];

  if (!mappedKey) {
    return;
  }

  event.preventDefault();

  if (mappedKey.type === "operator") {
    calculator.chooseOperator(mappedKey.value);
    flashKey(`[data-operator="${mappedKey.value}"]`);
  } else {
    runAction(mappedKey.value);
    flashKey(`[data-action="${mappedKey.value}"]`);
  }

  updateDisplay();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The calculator still works if offline support cannot be registered.
    });
  });
}

updateDisplay();

function handleButton(button) {
  const number = button.dataset.number;
  const operator = button.dataset.operator;
  const action = button.dataset.action;

  if (number !== undefined) {
    calculator.inputDigit(number);
  } else if (operator) {
    calculator.chooseOperator(operator);
  } else if (action) {
    runAction(action);
  }

  updateDisplay();
}

function runAction(action) {
  const actions = {
    clear: () => calculator.clear(),
    "toggle-sign": () => calculator.toggleSign(),
    percent: () => calculator.percent(),
    decimal: () => calculator.inputDecimal(),
    equals: () => calculator.equals()
  };

  actions[action]?.();
}

function updateDisplay() {
  const snapshot = calculator.getSnapshot();
  screen.value = snapshot.display;
  screen.textContent = snapshot.display;
  history.textContent = snapshot.history || "\u00a0";
}

function flashKey(selector) {
  const key = document.querySelector(selector);

  if (!key) {
    return;
  }

  key.classList.add("active");
  window.setTimeout(() => key.classList.remove("active"), 120);
}
