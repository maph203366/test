const MAX_INPUT_LENGTH = 12;

export const OPERATORS = {
  add: {
    symbol: "+",
    calculate: (left, right) => left + right
  },
  subtract: {
    symbol: "−",
    calculate: (left, right) => left - right
  },
  multiply: {
    symbol: "×",
    calculate: (left, right) => left * right
  },
  divide: {
    symbol: "÷",
    calculate: (left, right) => {
      if (right === 0) {
        throw new Error("Cannot divide by zero");
      }

      return left / right;
    }
  }
};

export class CalculatorEngine {
  constructor() {
    this.clear();
  }

  clear() {
    this.displayValue = "0";
    this.storedValue = null;
    this.pendingOperator = null;
    this.waitingForNextNumber = false;
    this.history = "";
    this.hasError = false;
  }

  inputDigit(digit) {
    this.resetAfterError();

    if (!/^\d$/.test(digit)) {
      return;
    }

    if (this.waitingForNextNumber) {
      this.displayValue = digit;
      this.waitingForNextNumber = false;
      return;
    }

    if (this.displayValue.replace("-", "").replace(".", "").length >= MAX_INPUT_LENGTH) {
      return;
    }

    this.displayValue = this.displayValue === "0" ? digit : `${this.displayValue}${digit}`;
  }

  inputDecimal() {
    this.resetAfterError();

    if (this.waitingForNextNumber) {
      this.displayValue = "0.";
      this.waitingForNextNumber = false;
      return;
    }

    if (!this.displayValue.includes(".")) {
      this.displayValue = `${this.displayValue}.`;
    }
  }

  chooseOperator(operatorName) {
    this.resetAfterError();

    if (!OPERATORS[operatorName]) {
      return;
    }

    const inputValue = Number(this.displayValue);

    if (this.pendingOperator && !this.waitingForNextNumber) {
      if (!this.performCalculation(inputValue)) {
        return;
      }
    } else {
      this.storedValue = inputValue;
    }

    this.pendingOperator = operatorName;
    this.waitingForNextNumber = true;
    this.history = `${this.displayValue} ${OPERATORS[operatorName].symbol}`;
  }

  equals() {
    this.resetAfterError();

    if (!this.pendingOperator || this.storedValue === null || this.waitingForNextNumber) {
      return;
    }

    const rightValue = Number(this.displayValue);
    const operator = OPERATORS[this.pendingOperator];
    const leftValue = this.storedValue;

    if (this.performCalculation(rightValue)) {
      this.history = `${formatNumber(leftValue)} ${operator.symbol} ${formatNumber(rightValue)} =`;
      this.pendingOperator = null;
      this.storedValue = null;
      this.waitingForNextNumber = true;
    }
  }

  toggleSign() {
    this.resetAfterError();

    if (this.displayValue === "0") {
      return;
    }

    this.displayValue = this.displayValue.startsWith("-")
      ? this.displayValue.slice(1)
      : `-${this.displayValue}`;
  }

  percent() {
    this.resetAfterError();

    const currentValue = Number(this.displayValue);
    const percentValue =
      this.storedValue !== null && this.pendingOperator
        ? (this.storedValue * currentValue) / 100
        : currentValue / 100;

    this.displayValue = formatNumber(percentValue);
  }

  getSnapshot() {
    return {
      display: this.displayValue,
      history: this.history
    };
  }

  performCalculation(rightValue) {
    const operator = OPERATORS[this.pendingOperator];

    try {
      const result = operator.calculate(this.storedValue, rightValue);
      this.displayValue = formatNumber(result);
      this.storedValue = Number(this.displayValue);
      return true;
    } catch (error) {
      this.displayValue = "Error";
      this.history = error.message;
      this.storedValue = null;
      this.pendingOperator = null;
      this.waitingForNextNumber = true;
      this.hasError = true;
      return false;
    }
  }

  resetAfterError() {
    if (this.hasError) {
      this.clear();
    }
  }
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if (Object.is(value, -0)) {
    return "0";
  }

  const rounded = Number.parseFloat(value.toPrecision(12));

  if (rounded === 0) {
    return "0";
  }

  if (Math.abs(rounded) >= 1e12 || Math.abs(rounded) < 1e-9) {
    return trimExponential(rounded.toExponential(6));
  }

  const plainText = rounded.toString();

  if (plainText.length <= MAX_INPUT_LENGTH + 2) {
    return plainText;
  }

  return trimTrailingZeros(rounded.toPrecision(MAX_INPUT_LENGTH));
}

function trimExponential(value) {
  return value.replace(/\.?0+e/, "e");
}

function trimTrailingZeros(value) {
  return value.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
}
