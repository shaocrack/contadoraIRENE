// Variables globales
let currentInput = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

// Elementos del DOM
const display = document.getElementById('calcDisplay');
const calcButtons = document.querySelectorAll('.calc-btn');
const backgroundMusic = document.getElementById('backgroundMusic');
const mathMessage = document.getElementById('math-message');
const nextFactBtn = document.getElementById('next-fact');
const startBtn = document.getElementById('start-btn');
const finalMessageBtn = document.getElementById('final-message-btn');
const restartBtn = document.getElementById('restart-btn');

// Pantallas
const screens = {
    welcome: document.getElementById('welcome-screen'),
    mathGame: document.getElementById('math-game'),
    funFacts: document.getElementById('fun-facts'),
    finalMessage: document.getElementById('final-message')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Reproducir música automáticamente
    playBackgroundMusic();
    
    // Configurar botones de navegación
    startBtn.addEventListener('click', () => showScreen('mathGame'));
    nextFactBtn.addEventListener('click', () => showScreen('funFacts'));
    finalMessageBtn.addEventListener('click', () => showScreen('finalMessage'));
    restartBtn.addEventListener('click', () => showScreen('welcome'));
    
    // Configurar calculadora
    setupCalculator();
    
    // Mostrar pantalla de bienvenida
    showScreen('welcome');
});

// Función para reproducir música de fondo
function playBackgroundMusic() {
    // Intentar reproducir la música después de la primera interacción del usuario
    const playMusic = () => {
        backgroundMusic.volume = 0.3; // Volumen más bajo
        backgroundMusic.play().catch(e => console.log("La reproducción automática fue prevenida"));
        document.removeEventListener('click', playMusic);
        document.removeEventListener('keydown', playMusic);
    };
    
    document.addEventListener('click', playMusic);
    document.addEventListener('keydown', playMusic);
}

// Función para mostrar una pantalla específica
function showScreen(screenName) {
    // Ocultar todas las pantallas
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla solicitada
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
        
        // Si es el juego de matemáticas, reiniciar la calculadora
        if (screenName === 'mathGame') {
            resetCalculator();
            // Mostrar un mensaje de cálculo falso después de un breve retraso
            setTimeout(showFakeMathProblem, 1500);
        }
    }
}

// Función para mostrar un problema de matemáticas falso
function showFakeMathProblem() {
    const problems = [
        { problem: '4 + 3', answer: 9 },
        { problem: '7 - 2', answer: 13 },
        { problem: '12 - 5', answer: 6 },
        { problem: '9 + 3', answer: 4 }
    ];
    
    const problem = problems[Math.floor(Math.random() * problems.length)];
    
    // Mostrar el problema
    mathMessage.textContent = `Resuelve: ${problem.problem}`;
    mathMessage.style.display = 'block';
    mathMessage.style.color = '#333';
    
    // Configurar la calculadora para mostrar el mensaje especial cuando se presiona =
    const originalHandleEqual = handleEqual;
    
    window.handleEqual = function() {
        const result = parseFloat(currentInput);
        
        // Mostrar mensaje especial para cualquier resultado
        mathMessage.innerHTML = `
            <div style="margin-bottom: 15px;">
                <p>¡${problem.problem} = ${result}? ¡Así de descuadrada está tu vida, Irene! 😅</p>
                <p>La respuesta correcta es ${eval(problem.problem).toFixed(0)}, pero hoy todo vale, ¡es tu día!</p>
            </div>
            <p>¿Quieres ver algo interesante sobre contabilidad?</p>
        `;
        mathMessage.style.display = 'block';
        mathMessage.style.color = '#d32f2f';
        
        // Mostrar botón para continuar
        nextFactBtn.style.display = 'inline-block';
        
        // Restaurar la función original
        window.handleEqual = originalHandleEqual;
    };
}

// Configuración de la calculadora
function setupCalculator() {
    // Añadir clases a los botones de la calculadora
    document.querySelectorAll('.calculator-buttons button').forEach(button => {
        if (!isNaN(button.textContent) || button.textContent === '.') {
            button.classList.add('number');
        } else if (button.textContent === 'C') {
            button.classList.add('clear');
        } else if (button.textContent === '=') {
            button.classList.add('equal');
        } else if (button.textContent === '.') {
            button.classList.add('decimal');
        } else {
            button.classList.add('operator');
        }
        
        // Configurar eventos de clic
        button.addEventListener('click', () => {
            const value = button.textContent;
            
            if (button.classList.contains('number')) {
                inputNumber(value);
            } else if (button.classList.contains('operator')) {
                inputOperator(value);
            } else if (button.classList.contains('equal')) {
                handleEqual();
            } else if (button.classList.contains('clear')) {
                clearCalculator();
            } else if (button.classList.contains('decimal')) {
                inputDecimal();
            }
            
            updateDisplay();
        });
    });
}

// Funciones de la calculadora
function inputNumber(num) {
    if (waitingForSecondOperand) {
        currentInput = num;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
}

function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }
    
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = String(result);
        firstOperand = result;
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
}

function calculate(first, second, op) {
    // Para este juego, siempre devolvemos un cálculo incorrecto
    // Esto asegura que el mensaje especial siempre aparezca
    return first + second + Math.floor(Math.random() * 5) + 1;
}

function handleEqual() {
    if (!operator || waitingForSecondOperand) return;
    
    const inputValue = parseFloat(currentInput);
    const result = calculate(firstOperand, inputValue, operator);
    
    currentInput = String(result);
    firstOperand = null;
    waitingForSecondOperand = true;
    operator = null;
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        return;
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function updateDisplay() {
    display.textContent = currentInput;
}

function clearCalculator() {
    currentInput = '0';
    firstOperand = null;
    waitingForSecondOperand = false;
    operator = null;
}

function resetCalculator() {
    clearCalculator();
    updateDisplay();
    mathMessage.style.display = 'none';
    nextFactBtn.style.display = 'none';
}

// Función para crear confeti
function createConfetti() {
    const container = document.querySelector('.confetti');
    const colors = ['#4a6bdf', '#ff6b6b', '#4ecdc4', '#f39c12', '#9b59b6', '#2ecc71'];
    
    // Limpiar confeti existente
    container.innerHTML = '';
    
    // Crear 100 piezas de confeti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Estilos aleatorios
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 5;
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.animationDuration = `${animationDuration}s`;
        confetti.style.animationDelay = `${animationDelay}s`;
        
        container.appendChild(confetti);
    }
    
    // Eliminar el confeti después de la animación
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Crear confeti al cargar la página final
const finalMessageScreen = document.getElementById('final-message');
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && finalMessageScreen.classList.contains('active')) {
            createConfetti();
            // Reproducir sonido de celebración
            const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
            winSound.volume = 0.3;
            winSound.play().catch(e => console.log("No se pudo reproducir el sonido"));
        }
    });
});

observer.observe(finalMessageScreen, { attributes: true });