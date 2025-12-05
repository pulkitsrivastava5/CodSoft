// Modern Calculator JavaScript
// Handles all calculator logic, UI updates, and button events

// Select display and buttons
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

// Calculator state
let currentInput = '';
let lastResult = '';
let resetNext = false;
let lastPressed = '';

// Utility: Format display
function updateDisplay(value) {
    display.textContent = value || '0';
}

// Utility: Check if last char is operator
function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// Utility: Safe eval with operator precedence
function calculate(expression) {
    try {
        // Replace division and multiplication symbols
        expression = expression.replace(/÷/g, '/').replace(/×/g, '*');
        // Remove invalid trailing operator
        while (isOperator(expression.slice(-1))) {
            expression = expression.slice(0, -1);
        }
        // Prevent divide by zero
        if (/\/0(?!\d)/.test(expression)) {
            return 'Error';
        }
        // Only allow numbers, operators, and dot
        if (!/^[-+*/.\d\s]+$/.test(expression)) return 'Error';
        // eslint-disable-next-line no-new-func
        let result = Function('return ' + expression)();
        // Handle floating point precision
        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
        }
        return result.toString();
    } catch {
        return 'Error';
    }
}

// Handle button clicks
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        if (btn.classList.contains('btn-num')) {
            if (resetNext) {
                currentInput = '';
                resetNext = false;
            }
            // Prevent leading zeros
            if (currentInput === '0') currentInput = '';
            currentInput += action;
            updateDisplay(currentInput);
            lastPressed = 'num';
        } else if (btn.classList.contains('btn-op')) {
            if (currentInput === '' && lastResult) {
                currentInput = lastResult;
            }
            // Allow chaining operations after result
            if (resetNext && lastResult) {
                currentInput = lastResult;
                resetNext = false;
            }
            // Prevent double operator
            if (isOperator(currentInput.slice(-1))) {
                currentInput = currentInput.slice(0, -1);
            }
            currentInput += action;
            updateDisplay(currentInput);
            lastPressed = 'op';
        } else if (btn.classList.contains('btn-dot')) {
            // Prevent multiple dots in a number
            const parts = currentInput.split(/[-+*/]/);
            if (!parts[parts.length - 1].includes('.')) {
                currentInput += '.';
                updateDisplay(currentInput);
            }
            lastPressed = 'dot';
        } else if (btn.classList.contains('btn-eq')) {
            if (currentInput === '') return;
            const result = calculate(currentInput);
            updateDisplay(result);
            lastResult = result !== 'Error' ? result : '';
            resetNext = true;
            lastPressed = 'eq';
        } else if (btn.classList.contains('btn-ac')) {
            currentInput = '';
            lastResult = '';
            updateDisplay('0');
            lastPressed = 'ac';
        } else if (btn.classList.contains('btn-del')) {
            if (resetNext) {
                currentInput = '';
                resetNext = false;
            } else {
                currentInput = currentInput.slice(0, -1);
            }
            updateDisplay(currentInput);
            lastPressed = 'del';
        }
    });
});

// Keyboard support (optional, for better UX)
document.addEventListener('keydown', e => {
    const key = e.key;
    if (/\d/.test(key)) {
        document.querySelector(`.btn-num[data-action="${key}"]`)?.click();
    } else if (['+', '-', '*', '/'].includes(key)) {
        document.querySelector(`.btn-op[data-action="${key}"]`)?.click();
    } else if (key === '.') {
        document.querySelector('.btn-dot')?.click();
    } else if (key === 'Enter' || key === '=') {
        document.querySelector('.btn-eq')?.click();
    } else if (key === 'Backspace') {
        document.querySelector('.btn-del')?.click();
    } else if (key.toLowerCase() === 'c') {
        document.querySelector('.btn-ac')?.click();
    }
});

// Responsive font size for display
function resizeDisplayFont() {
    const displayDiv = display;
    let fontSize = 2.5;
    while (displayDiv.scrollWidth > displayDiv.clientWidth && fontSize > 1.2) {
        fontSize -= 0.1;
        displayDiv.style.fontSize = fontSize + 'rem';
    }
}

const observer = new MutationObserver(resizeDisplayFont);
observer.observe(display, { childList: true, characterData: true, subtree: true });

// Initial display
updateDisplay('0');

// Dark mode toggle logic
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'Toggle Light Mode');
    } else {
        themeToggle.textContent = '🌙';
        themeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
    }
});
