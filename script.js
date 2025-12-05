// Calculator state
const calculator = {
    currentOperand: '0',
    previousOperand: '',
    operation: undefined,
    waitingForNewOperand: false
};

// DOM Elements
const currentOperandElement = document.getElementById('current-operand');
const previousOperandElement = document.getElementById('previous-operand');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="equals"]');

// Update display
function updateDisplay() {
    currentOperandElement.textContent = calculator.currentOperand;
    
    if (calculator.operation) {
        previousOperandElement.textContent = 
            `${calculator.previousOperand} ${getOperationSymbol(calculator.operation)}`;
    } else {
        previousOperandElement.textContent = calculator.previousOperand;
    }
}

// Get symbol for operation
function getOperationSymbol(operation) {
    switch(operation) {
        case 'add': return '+';
        case 'subtract': return '-';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}

// Append number to current operand
function appendNumber(number) {
    // If we're waiting for a new operand, replace current operand
    if (calculator.waitingForNewOperand) {
        calculator.currentOperand = number;
        calculator.waitingForNewOperand = false;
    } else {
        // Prevent multiple decimal points
        if (number === '.' && calculator.currentOperand.includes('.')) return;
        
        // Replace '0' with the number, unless it's '0.'
        if (calculator.currentOperand === '0' && number !== '.') {
            calculator.currentOperand = number;
        } else {
            calculator.currentOperand += number;
        }
    }
    
    updateDisplay();
}

// Choose operation
function chooseOperation(action) {
    // If no current operand, do nothing
    if (calculator.currentOperand === '') return;
    
    // If we have a previous operand, calculate it first
    if (calculator.previousOperand !== '' && !calculator.waitingForNewOperand) {
        calculate();
    }
    
    // Set the operation
    calculator.operation = action;
    calculator.previousOperand = calculator.currentOperand;
    calculator.waitingForNewOperand = true;
    
    updateDisplay();
}

// Perform calculation
function calculate() {
    let computation;
    const prev = parseFloat(calculator.previousOperand);
    const current = parseFloat(calculator.currentOperand);
    
    // If either operand is not a number, return
    if (isNaN(prev) || isNaN(current)) return;
    
    switch(calculator.operation) {
        case 'add':
            computation = prev + current;
            break;
        case 'subtract':
            computation = prev - current;
            break;
        case 'multiply':
            computation = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clearCalculator();
                return;
            }
            computation = prev / current;
            break;
        case 'percentage':
            computation = prev * (current / 100);
            break;
        default:
            return;
    }
    
    // Round to avoid floating point precision issues
    computation = Math.round(computation * 100000000) / 100000000;
    
    calculator.currentOperand = computation.toString();
    calculator.operation = undefined;
    calculator.previousOperand = '';
    calculator.waitingForNewOperand = true;
    
    updateDisplay();
}

// Clear calculator
function clearCalculator() {
    calculator.currentOperand = '0';
    calculator.previousOperand = '';
    calculator.operation = undefined;
    calculator.waitingForNewOperand = false;
    updateDisplay();
}

// Delete last digit
function deleteLastDigit() {
    if (calculator.currentOperand.length === 1) {
        calculator.currentOperand = '0';
    } else {
        calculator.currentOperand = calculator.currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// Calculate percentage
function calculatePercentage() {
    if (calculator.currentOperand === '0') return;
    
    const current = parseFloat(calculator.currentOperand);
    calculator.currentOperand = (current / 100).toString();
    updateDisplay();
}

// Handle button clicks
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.getAttribute('data-number'));
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        
        switch(action) {
            case 'clear':
                clearCalculator();
                break;
            case 'backspace':
                deleteLastDigit();
                break;
            case 'equals':
                calculate();
                break;
            case 'percentage':
                calculatePercentage();
                break;
            default:
                chooseOperation(action);
        }
    });
});

// Keyboard support
document.addEventListener('keydown', event => {
    const key = event.key;
    
    // Number keys
    if (/^[0-9]$/.test(key)) {
        appendNumber(key);
    }
    
    // Decimal point
    if (key === '.') {
        appendNumber('.');
    }
    
    // Operations
    if (key === '+') {
        chooseOperation('add');
    }
    
    if (key === '-') {
        chooseOperation('subtract');
    }
    
    if (key === '*') {
        chooseOperation('multiply');
    }
    
    if (key === '/') {
        event.preventDefault(); // Prevent browser search shortcut
        chooseOperation('divide');
    }
    
    // Equals or Enter
    if (key === '=' || key === 'Enter') {
        calculate();
    }
    
    // Escape for clear
    if (key === 'Escape') {
        clearCalculator();
    }
    
    // Backspace for delete
    if (key === 'Backspace') {
        deleteLastDigit();
    }
    
    // Percentage
    if (key === '%') {
        calculatePercentage();
    }
});

// Initialize display
updateDisplay();