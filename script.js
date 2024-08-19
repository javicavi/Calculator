let firstOperand = "";
let currentOperator = "";
let secondOperand = "";
let concatCheck = false;

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const percentButton = document.getElementById("percentBtn");
const clearEntryButton = document.getElementById("ceBtn");
const clearButton = document.getElementById("cBtn");
const plusMinusButton = document.getElementById("plusMinusBtn");
const pointButton = document.getElementById("pointBtn");
const equalsButton = document.getElementById("equalsBtn");
const lastOperationScreen = document.getElementById("lastOperationScreen");
const currentOperationScreen = document.getElementById("currentOperationScreen");
// MUST CHECK
const allButtons = Array.from(document.getElementsByTagName("button"));

percentButton.addEventListener("click", () => {
  secondOperand = currentOperationScreen.textContent;
  currentOperationScreen.textContent = percent(firstOperand, secondOperand);
});
clearEntryButton.addEventListener("click", clearEntry);
clearButton.addEventListener("click", clear);
plusMinusButton.addEventListener("click", () => 
  currentOperationScreen.textContent = positiveNegative(currentOperationScreen.textContent)
);
equalsButton.addEventListener("click", evaluate);
pointButton.addEventListener("click", appendPoint);

numberButtons.forEach(button =>
  button.addEventListener('click', () => appendNumber(button.textContent))
);

operatorButtons.forEach(button => 
  button.addEventListener("click", () => dataOperator(button.textContent))
);

function appendNumber(number){
  // currentOperationScreen.textContent === "0" || firstOperand === currentOperationScreen.textContent
  //  ? currentOperationScreen.textContent = number
  //   : currentOperationScreen.append(number);
  if (currentOperationScreen.textContent === "0") {
    currentOperationScreen.textContent = number;
  } else if (concatCheck == true) {
    currentOperationScreen.textContent = number;
    lastOperationScreen.textContent = "";
    concatCheck = false;
  } else {
    currentOperationScreen.append(number);
  }
}

function appendPoint() {
  const dotCheck = /\./.test(currentOperationScreen.textContent);
  if(dotCheck === false)
    currentOperationScreen.textContent += ".";
}

function clearEntry() {
  currentOperationScreen.textContent = "0";
}

function clear() {
  // MUST CHECK
  if(currentOperationScreen.textContent === "ERROR") {
    clearButton.classList.remove("btn-red");
    allButtons.forEach(b => {
      if(b.id !== "cBtn")
        b.disabled = false;
    });
  }
  firstOperand = "";
  currentOperator = "";
  secondOperand = "";
  lastOperationScreen.textContent = "";
  currentOperationScreen.textContent = "0";
}

function dataOperator(operator) {
  if (currentOperator !== "") {
    lastOperationScreen.textContent = `${firstOperand} ${operator}`;
    currentOperator = operator;
  }
  else {
    firstOperand = currentOperationScreen.textContent;
    currentOperator = operator;
    lastOperationScreen.textContent = `${firstOperand} ${operator}`;
    currentOperationScreen.textContent = "0";
  }
  // concatCheck = false;
}

function evaluate() {
  const equalCheck = /=/.test(lastOperationScreen.textContent);
  if(equalCheck === false) {
    secondOperand = currentOperationScreen.textContent;
    lastOperationScreen.textContent += ` ${secondOperand} =`;
    currentOperationScreen.textContent = operate(currentOperator, firstOperand, secondOperand);
    firstOperand = "";
    currentOperator = "";
    secondOperand = "";
    concatCheck = true;
  }
}

function positiveNegative(num) {
  return num - (num * 2)
}

function add(a, b) {
  return a + b;
}

function substract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function percent(p, num) {
  return (Number(p) / 100) * Number(num);
}

function operate(operator, a, b) { 
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return substract(a, b);
    case "x":
      return multiply(a, b);
    case "÷":
      if(b === 0) {
        clearButton.classList.add("btn-red");
        // MUST CHECK
        allButtons.forEach(b => {
          if(b.id !== "cBtn")
            b.disabled = true
        });
        return currentOperationScreen.textContent = "ERROR";
      } else return divide(a, b);
    default:
      return null;
  }
}
