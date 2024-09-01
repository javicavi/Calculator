let operand1 = "";
let operand2 = "";
let operator = ""; 
let operandAccumulator  = "";
let equalDecimalOp1 = false;

const equalRegex = /=/;
const dotRegex = /\./;

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
// Converted to an array in order to use a forEach
const allButtons = Array.from(document.getElementsByTagName("button"));
const errorMsg = "You cannot divide by zero";


// window.addEventListener('keydown', keyboardSupport);

// percentButton.addEventListener("click", () => {
//   secondOpd= mainScreen.textContent;
//   mainScreen.textContent = percent(firstOpd, secondOpd);
// });

// // clearEntryButton.addEventListener("click", clearEntry);

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

function appendNumber(num)
{
  // Avoid concatenating zeros
  if(mainScreen.textContent === "0" && num === "0") return;

  else 
  {
    if(operator == "") 
    {
      if(operand1 == "") operand1 = num;
      else operand1 += num;
      redraw(operand1);
    }

    else if(operator != "" 
      && operand2 == "")
    {
      operand2 = num;
      redraw(num);
    }

    else if(operand1 != "" 
      && operator != "" 
      && operand2 == "")
    {
      operand2 = num;
      redraw(num);
    }

    else if(equalRegex.test(secondaryScreen.textContent) == true)
    {
      operand1 = num;
      redraw(operand1);
    }

    else 
    {
      if(secondaryScreen.textContent == "")
      {
        operand1 += num;
        redraw(operand1);
      }
      else {
        operand2 += num;
        redraw(operand2);
      }
    } 
  }
}

function appendOperator(_operator)
{
  if(operand1 != "" 
    && operator == "" 
    && operand2 == "" 
    && operandAccumulator == "")
  {
    operator = _operator;
    if(dotRegex.test(operand1) == true) operand1 = pointCheck(operand1);
    redraw(operator);
  }

  else if(operand1 != "" 
    && operator != "" 
    && operand2 == "" 
    && operandAccumulator == "")
  {

    operator = _operator;
    redraw(operator);
  }

  else if(operand1 != "" 
    && operator != "" 
    && operand2 != "" 
    && operandAccumulator != "")
  {
    operand1 = operandAccumulator;
    operator = _operator;
    operand2 = "";
    redraw(operator);
  }

  else if(operand1 != "" 
    && operator != "" 
    && operand2 != "" 
    && operandAccumulator == "")
  {
    operand1 = operate(operator, operand1, operand2);
    operand1 = operand1.toString();
    operand1 = pointCheck(operand1);
    operand2 = "";
    operator = _operator;
    redraw(_operator);
  }

  else
  {
    operand2 = mainScreen.textContent;
    operand1 = operate(operator, operand1, operand2);
    operand1 = operand1.toString();
    operand1 = pointCheck(operand1);
    operand2 = "";
    operator = _operator;
    redraw(_operator)
  }
}

function redraw(element)
{
  if(operand2 == "" 
    && operator == "" 
    && operandAccumulator == "")
  {
    mainScreen.textContent = element;
  }

  else if(operand1 != "" 
    && operator != "" 
    && operand2 == "" 
    && operandAccumulator == "") 
  {
    if(operand1 == "ERROR") secondaryScreen.textContent = errorMsg;
    else secondaryScreen.textContent = `${operand1} ${operator}`;
    mainScreen.textContent = `${operand1}`;
  }

  else if(operator != "" 
    && operand2 != "" 
    && operandAccumulator == "")
  {
    if(equalRegex.test(secondaryScreen.textContent) == true)
    {
      mainScreen.textContent = operand1;
      clearSecondaryScreen();
    }

    else if(secondaryScreen.textContent == "")
    {
      mainScreen.textContent = operand1;
    }

    else mainScreen.textContent = operand2;
  }

  else if(operator != "" 
    && operand2 == "" 
    && operandAccumulator != "")
  {
    mainScreen.textContent = operandAccumulator;
    secondaryScreen.textContent = `${operandAccumulator} ${operator}`;
  }

  else 
  {
    if(operand2 == "") 
    {
      mainScreen.textContent = "0";
      secondaryScreen.textContent = `${operand1} ${operator}`;
    } 

    else mainScreen.textContent = operand2;
  }
}

function clearSecondaryScreen()
{
  secondaryScreen.textContent = "";
}

function clear()
{
  if (mainScreen.textContent === "ERROR")
  {
    clearButton.classList.remove("btn-red");
    allButtons.forEach(button => {
      if (button.id !== "cBtn")
        button.disabled = false;
    });
  }
  operand1 = "";
  operator = "";
  operand2 = "";
  operandAccumulator = "";
  mainScreen.textContent = "0";
  secondaryScreen.textContent = "";  
}

function appendPoint()
{
  if (dotRegex.test(mainScreen.textContent) === false)
  {
    if(operator == "" && operand2 == "")
    {
      if(operand1 == "") operand1 = "0";
      operand1 += ".";
      return redraw(operand1);
    }

    // Avoid concatenating the decimal point with the second operand once the operation has been completed
    else if(equalRegex.test(secondaryScreen.textContent) == true)
    {
      clear(); // <--- ¿Cambiar por CE cuando se implemente?
      operand1 += "0.";
      return redraw(operand1);
    }

    else
    {
      if(equalDecimalOp1 == true)
      {
        console.log("OKI")
        operand1 += ".";
        return redraw(operand1);
      }
      else {
        if(operand2 != "") operand2 += ".";
        else operand2 = "0.";
        return redraw(operand2);
      }
    }
  }
}

function pointCheck(num)
{

  while (num.slice(-1) == "0" && dotRegex.test(mainScreen.textContent) == true && operand2 != "0") num = num.slice(0,-1);

  if(num.slice(-1) == ".") num = num.slice(0,-1);

  return num; 
}

function equal()
{
  if(operator != "" && operand1 != "")
  {
    if(operand2 == "") operand2 = mainScreen.textContent;

    if(secondaryScreen.textContent == "")
    {
      secondaryScreen.textContent = `${operand1} ${operator} ${operand2} =`
      mainScreen.textContent = operate(operator, operand1, operand2);
      operandAccumulator = mainScreen.textContent;
    }
    else
    {
      operand2 = pointCheck(operand2); // <----- DECIMAL
      secondaryScreen.textContent += ` ${operand2} =`;
      mainScreen.textContent = operate(operator, operand1, operand2);
      operandAccumulator = mainScreen.textContent;
    }
  }

  const equalCheck = /(.*=.*=)/.test(secondaryScreen.textContent);

  // Avoid chaining operations without resolving them on secondaryScreen
  if(equalCheck == true) 
  {
    operandAccumulator = mainScreen.textContent;
    operand1 = operandAccumulator;
    secondaryScreen.textContent = `${operand1} ${operator} ${operand2} =`;
    mainScreen.textContent = operate(operator, operand1, operand2);
    operandAccumulator = true;
  }
  
  else
  {
    equalDecimalOp1 = true;
    operandAccumulator = "";
  }
}

function add(a, b)
{
  return a + b;
}

function substract(a, b)
{
  return a - b;
}

function multiply(a, b)
{
  return a * b;
}

function divide(a, b)
{
  return a / b;
}

function operate(operator, a, b)
{
  a = Number(a);
  b = Number(b);
  let result;

  switch (operator)
  {
    case "+":
      result = add(a, b);
      break;

    case "-":
      result = substract(a, b);
      break;

    case "x":
      result = multiply(a, b);
      break;

    case "÷":
      if (b == "0")
      {
        clearButton.classList.add("btn-red");
        allButtons.forEach(button => {
          if (button.id !== "cBtn") button.disabled = true;
        });

        secondaryScreen.textContent = errorMsg;
        return mainScreen.textContent = "ERROR";
      } 
      else result = divide(a, b);
      break;

    default:
      return "0";
  }
  
  return Math.round((result + Number.EPSILON) * 100) / 100;
}

// function percent(p, num){
//   if (num == "") num = mainScreen.textContent;
//   return (Number(p) / 100) * Number(num);
// }

function positiveNegative(num)
{
  const plusMinus = num - (num * 2)

  if(operator == "" && operand2 == "")
  {
    operand1 = plusMinus;
    return plusMinus;
  }
  else
  {
    operand2 = plusMinus;
    return plusMinus;
  }  
}

// function keyboardSupport(e){
//   if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
//   if (e.key === ".") appendPoint();
//   if (e.key === "Backspace") clearEntry();
//   if (e.key === "Delete") clear();
//   if (e.key === "%") mainScreen.textContent = percent(firstOpd, secondOpd); // Check
//   if (e.key === "Enter") equal();
//   if (e.key === "+" || e.key === "-") appendOperator(e.key);
//   if (e.key === "*") appendOperator("x");
//   if (e.key === "/") appendOperator("÷");
// }

// function clearEntry(){
//   mainScreen.textContent = "0";
//   avoidConcat = true;
// }