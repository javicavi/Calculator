let firstOpd = "";
let currentOperator = "";
let secondOpd = "";
// Change to concat?
let mainScreenEmpty = true;

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const percentButton = document.getElementById("percentBtn");
const clearEntryButton = document.getElementById("ceBtn");
const clearButton = document.getElementById("cBtn");
const plusMinusButton = document.getElementById("plusMinusBtn");
const pointButton = document.getElementById("pointBtn");
const equalsButton = document.getElementById("equalsBtn");
const secondaryScreen = document.getElementById("lastOperationScreen");
const mainScreen = document.getElementById("currentOperationScreen");
// It is converted to an array in order to use a forEach
const allButtons = Array.from(document.getElementsByTagName("button"));


window.addEventListener('keydown', keyboardSupport);

percentButton.addEventListener("click", () => {
  secondOpd= mainScreen.textContent;
  mainScreen.textContent = percent(firstOpd, secondOpd);
});

clearEntryButton.addEventListener("click", clearEntry);

clearButton.addEventListener("click", clear);

plusMinusButton.addEventListener("click", () => 
  mainScreen.textContent = positiveNegative(mainScreen.textContent)
);

equalsButton.addEventListener("click", equal);

pointButton.addEventListener("click", appendPoint);

numberButtons.forEach(button =>
  button.addEventListener('click', () => appendNumber(button.textContent))
);

operatorButtons.forEach(button => 
  button.addEventListener("click", () => appendOperator(button.textContent))
);

function keyboardSupport(e){
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === ".") appendPoint();
  if (e.key === "Backspace") clearEntry();
  if (e.key === "Delete") clear();
  if (e.key === "%") mainScreen.textContent = percent(firstOpd, secondOpd); // Check
  if (e.key === "Enter") equal();
  if (e.key === "+" || e.key === "-") appendOperator(e.key);
  if (e.key === "*") appendOperator("x");
  if (e.key === "/") appendOperator("÷");
}

function clearEntry(){
  mainScreen.textContent = "0";
  mainScreenEmpty = true;
}

function clear(){
  if (mainScreen.textContent === "ERROR"){
    clearButton.classList.remove("btn-red");
    allButtons.forEach(button => {
      if (button.id !== "cBtn")
        button.disabled = false;
    });
  }
  mainScreen.textContent = "0";
  secondaryScreen.textContent = "";
  firstOpd = "";
  currentOperator = "";
  secondOpd = "";
  mainScreenEmpty = true;
}

function appendNumber(number){
  if (mainScreenEmpty === true){
    mainScreenEmpty = false;
    mainScreen.textContent = number;
  } else {
    mainScreen.textContent += number;
  }
}

function appendOperator(operator){
  firstOpd = mainScreen.textContent;
  // Prevent it from showing the point without a decimal
  firstOpd = pointCheck(firstOpd);
  mainScreen.textContent = firstOpd;
  currentOperator = operator;
  secondaryScreen.textContent = `${firstOpd} ${currentOperator}`;
  mainScreenEmpty = true;
}

function equal(){
  // Prevent using equal without an operator
  if (currentOperator !== ""){
    const equalCheck = /=/.test(secondaryScreen.textContent);
    if (equalCheck === false){
      firstOpd = pointCheck(firstOpd);
      secondOpd = mainScreen.textContent;
      secondaryScreen.textContent += ` ${secondOpd} =`;
      // Round to at most 2 decimal places, if necessary
      mainScreen.textContent = Math.round(
        (operate(currentOperator, firstOpd, secondOpd) + Number.EPSILON) * 100) / 100;
      if (mainScreen.textContent === "NaN") mainScreen.textContent = "ERROR"
      firstOpd = "";
      currentOperator = "";
      secondOpd = "";
      mainScreenEmpty = true;
    }
  }
}

function add(a, b){
  return a + b;
}

function substract(a, b){
  return a - b;
}

function multiply(a, b){
  return a * b;
}

function divide(a, b){
  return a / b;
}

function operate(operator, a, b){ 
  a = Number(a);
  b = Number(b);
  switch (operator){
    case "+":
      return add(a, b);
    case "-":
      return substract(a, b);
    case "x":
      return multiply(a, b);
    case "÷":
      if (b == "0"){ // CHECK
        clearButton.classList.add("btn-red");
        allButtons.forEach(button => {
          if (button.id !== "cBtn")
            button.disabled = true;
        });
        // WHY ???
        return mainScreen.textContent = "ERROR";
      } else return divide(a, b);
    default:
      return null;
  }
}

function percent(p, num){
  if (num == "") num = mainScreen.textContent;
  return (Number(p) / 100) * Number(num);
}

function positiveNegative(num){
  return num - (num * 2)
}

function appendPoint(){
  const dotCheck = /\./.test(mainScreen.textContent);
  if (dotCheck === false)
    mainScreen.textContent += ".";
}

function pointCheck(num){
  if (num.slice(-1) == "."){
    return num = num.slice(0,-1);
  }
  return num;
}