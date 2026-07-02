import assert from "node:assert/strict";
import test from "node:test";

import { CalculatorEngine } from "../calculator.js";

test("adds two numbers", () => {
  const calculator = new CalculatorEngine();

  calculator.inputDigit("2");
  calculator.chooseOperator("add");
  calculator.inputDigit("3");
  calculator.equals();

  assert.equal(calculator.getSnapshot().display, "5");
  assert.equal(calculator.getSnapshot().history, "2 + 3 =");
});

test("supports chained calculations", () => {
  const calculator = new CalculatorEngine();

  calculator.inputDigit("8");
  calculator.chooseOperator("multiply");
  calculator.inputDigit("3");
  calculator.chooseOperator("subtract");
  calculator.inputDigit("4");
  calculator.equals();

  assert.equal(calculator.getSnapshot().display, "20");
});

test("handles decimal input without floating point noise", () => {
  const calculator = new CalculatorEngine();

  calculator.inputDigit("0");
  calculator.inputDecimal();
  calculator.inputDigit("1");
  calculator.chooseOperator("add");
  calculator.inputDigit("0");
  calculator.inputDecimal();
  calculator.inputDigit("2");
  calculator.equals();

  assert.equal(calculator.getSnapshot().display, "0.3");
});

test("converts the current value to a percentage", () => {
  const calculator = new CalculatorEngine();

  calculator.inputDigit("5");
  calculator.inputDigit("0");
  calculator.percent();

  assert.equal(calculator.getSnapshot().display, "0.5");
});

test("uses the stored value for percentage during an operation", () => {
  const calculator = new CalculatorEngine();

  calculator.inputDigit("2");
  calculator.inputDigit("0");
  calculator.inputDigit("0");
  calculator.chooseOperator("add");
  calculator.inputDigit("1");
  calculator.inputDigit("0");
  calculator.percent();
  calculator.equals();

  assert.equal(calculator.getSnapshot().display, "220");
});

test("toggles the sign of non-zero values", () => {
  const calculator = new CalculatorEngine();

  calculator.inputDigit("9");
  calculator.toggleSign();

  assert.equal(calculator.getSnapshot().display, "-9");
});

test("shows an error for division by zero and recovers on next input", () => {
  const calculator = new CalculatorEngine();

  calculator.inputDigit("8");
  calculator.chooseOperator("divide");
  calculator.inputDigit("0");
  calculator.equals();

  assert.equal(calculator.getSnapshot().display, "Error");

  calculator.inputDigit("4");

  assert.equal(calculator.getSnapshot().display, "4");
});
