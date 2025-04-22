// Состояние игры
const gameState = {
    hunger: 80,
    happiness: 70,
    energy: 90,
    coins: 150,
    currentScreen: 'pet',
    petState: 'happy'
};

// DOM элементы
const elements = {
    petImage: document.getElementById('pet-image'),
    hungerBar: document.getElementById('hunger-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    energyBar: document.getElementById('energy-bar'),
    coinsDisplay: document.getElementById('coins'),
    speechBubble: document.getElementById('speech'),
    notification: document.getElementById('notification'),
    screens: document.querySelectorAll('[data-tab]'),
    tabButtons: document.querySelectorAll('.tab-btn')
};

// Инициализация Telegram WebApp
function initTelegramApp() {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.enableClosingConfirmation();
}

// Переключение экранов
function switchScreen(screenId) {
    // Скрыть все экраны
    elements.screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показать выбранный экран
    document.querySelector(`[data-tab="${screenId}"]`).classList.add('active');
    
    // Обновить активную кнопку
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === screenId);
    });
    
    gameState.currentScreen = screenId;
}

// Обновление интерфейса
function updateUI() {
    elements.hungerBar.style.width = `${gameState.hunger}%`;
    elements.happinessBar.style.width = `${gameState.happiness}%`;
    elements.energyBar.style.width = `${gameState.energy}%`;
    elements.coinsDisplay.textContent = gameState.coins;
}

// Показать уведомление
function showNotification(text) {
    elements.notification.textContent = text;
    elements.notification.style.opacity = '1';
    
    setTimeout(() => {
        elements.notification.style.opacity = '0';
    }, 2000);
}

// Инициализация игры
function initGame() {
    initTelegramApp();
    updateUI();
    
    // Обработчики для нижней панели
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchScreen(btn.dataset.tab);
        });
    });
    
    // Клик по питомцу
    elements.petImage.addEventListener('click', () => {
        if (gameState.petState === 'happy') {
            elements.speechBubble.textContent = getRandomPhrase();
            animateSpeechBubble();
        }
    });
    
    // Игровой цикл
    setInterval(gameLoop, 60000);
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
