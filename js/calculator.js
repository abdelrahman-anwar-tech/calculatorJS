class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.history = [];
        this.isScientificMode = false;
        this.isDarkTheme = false;
        this.updateDisplay();
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
        this.updateDisplay();
    }

    appendOperator(operator) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Add to history
        this.addToHistory(`${prev} ${this.operation} ${current} = ${computation}`);

        this.currentOperand = Number(computation.toFixed(8)).toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    calculateSquare() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.addToHistory(`${current}² = ${current * current}`);
        this.currentOperand = (current * current).toString();
        this.updateDisplay();
    }

    calculateSquareRoot() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        if (current < 0) {
            alert('Cannot calculate square root of a negative number!');
            return;
        }
        
        this.addToHistory(`√${current} = ${Math.sqrt(current)}`);
        this.currentOperand = Math.sqrt(current).toString();
        this.updateDisplay();
    }

    calculatePercent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.addToHistory(`${current}% = ${current / 100}`);
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }

    toggleSign() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (-current).toString();
        this.updateDisplay();
    }

    addToHistory(entry) {
        this.history.push(entry);
        if (this.history.length > 5) {
            this.history.shift();
        }
        this.updateDisplay();
    }

    toggleMode() {
        this.isScientificMode = !this.isScientificMode;
        const modeToggle = document.getElementById('modeToggle');
        const scientificBtns = document.querySelectorAll('.scientific-btn');
        
        modeToggle.textContent = this.isScientificMode ? 'Scientific' : 'Standard';
        scientificBtns.forEach(btn => {
            btn.style.display = this.isScientificMode ? 'block' : 'none';
        });

        // Add fade animation
        const grid = document.getElementById('calculatorGrid');
        grid.classList.add('fade');
        setTimeout(() => grid.classList.remove('fade'), 300);
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.textContent = this.isDarkTheme ? '☀️' : '🌙';
    }

    updateDisplay() {
        document.getElementById('currentOperand').textContent = this.currentOperand;
        if (this.operation != null) {
            document.getElementById('previousOperand').textContent = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            document.getElementById('previousOperand').textContent = '';
        }
        
        // Update history display
        document.getElementById('history').innerHTML = this.history
            .slice(-3)
            .map(entry => `<div>${entry}</div>`)
            .join('');
    }
}

const calculator = new Calculator();

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    // Hide scientific buttons initially
    document.querySelectorAll('.scientific-btn').forEach(btn => {
        btn.style.display = 'none';
    });

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9' || event.key === '.') {
            calculator.appendNumber(event.key);
        } else if (event.key === '+' || event.key === '-') {
            calculator.appendOperator(event.key);
        } else if (event.key === '*') {
            calculator.appendOperator('×');
        } else if (event.key === '/') {
            event.preventDefault();
            calculator.appendOperator('÷');
        } else if (event.key === 'Enter' || event.key === '=') {
            calculator.compute();
        } else if (event.key === 'Backspace') {
            calculator.delete();
        } else if (event.key === 'Escape') {
            calculator.clear();
        }
    });
});